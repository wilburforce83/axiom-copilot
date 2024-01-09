
const helper = require("../tools/helpers");
const log = require('log-to-file');
const logfile = "log.txt";
require("dotenv").config({ path: "./process.env" });
const canary = require("canarylabs-web-api"); // when using from npm use require('canarylabs-web-api')
var tVal;
var id;
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
})

// AXIOM API collection

const credentials = {
    username: process.env.MY_USERNAME || "default_username",
    password: process.env.MY_PASSWORD || "default_password",
    baseURL:
        process.env.MY_BASE_URL ||
        "https://yourdomain.canarylabs.online:55236/api/v2",
};

let userTokenBody = {
    application: "Web API",
    timezone: "GMT Standard Time",
};

// Fire up WhatsApp and collect authorisation
client.on('ready', () => {
    console.log('Whatsapp is ready, and already authorised!');

    (async () => {
        try {
            const chats = await client.getChats();
            let chat = helper.filterArrayByString(chats, "Green Create/ FGS ");  // "Green Create/ FGS " "Kent Ops (internal)"
            console.log(chat[0].id._serialized);
            id = chat[0].id._serialized;
            // Now you can use the 'chats' variable in the rest of your code
            // fgs_update(); // comment out after testing
            // axiom logic


        } catch (error) {
            console.error("Error fetching chats:", error);
            // Handle the error or log it as needed
        }
    })();

});

// If WhatsApp isn't authorised trigger a log event. To authorise run node whatsapp_Auth.js and link to your account with the QR code.
client.on("qr", async (qr) => {

    console.log("Whatsapp is asking for QR you are not authenticated");
    log("Whatsapp is asking for QR you are not authenticated", logfile);
    console.log(qr);

});

// Trigger initialization of WhatsApp
client.initialize();

// Main FGS update function

const fgs_update = async () => {

    var now = new Date();
    var hours = now.getHours()
    try {
        let result = await canary.getUserToken(credentials, userTokenBody);
        log(result.userToken, logfile);

        // Make sure browseTags returns a promise
        let browseTagsResult = await canary.browseTags(credentials);

        let effPitResult1 = await canary.getRawData(
            credentials,
            { startTime: "Now - 2h", tags: "GreenCreate.Kent.Level.LT1230_PV" },
            null
        ); //return array of values for 2 hours
        let effPitResult2 = await canary.getRawData(
            credentials,
            { startTime: "Now - 4h", tags: "GreenCreate.Kent.Level.LT1230_PV" },
            null
        ); //return array of values for 4 hours
        // console.log(effPitResult1, effPitResult2);
        var effPitTrend1 = helper.basicTrend(
            helper.extractValues(
                effPitResult1.data["GreenCreate.Kent.Level.LT1230_PV"]
            ),
            5
        );
        var effPitTrend2 = helper.basicTrend(
            helper.extractValues(
                effPitResult2.data["GreenCreate.Kent.Level.LT1230_PV"]
            ),
            5
        );


        // Check if browseTags was successful before calling getLiveDataToken
        if (browseTagsResult) {
            let liveDataResult = await canary.getLiveDataToken(credentials);

            if (liveDataResult) {
                tVal = await canary.storeLatestValues(credentials);

                var effPitLevel = tVal["GreenCreate.Kent.Level.LT1230_PV"];


                let totalToBag = await canary.getProcessedData(credentials, {

                    "userToken": "{{UserToken}}",
                    "tags": ["GreenCreate.Kent.Flow.FT1711_Tot"],
                    "startTime": "16:00",
                    "endTime": "now",
                    "maxSize": 10,
                    "aggregateName": "Delta",
                    "aggregateInterval": "24 hours"

                });

                let averageToBag = await canary.getProcessedData(credentials, {

                    "tags": ["GreenCreate.Kent.Flow.FT1711_Tot"],
                    "startTime": "now-4hours",
                    "endTime": "now",
                    "maxSize": 10,
                    "aggregateName": "Delta",
                    "aggregateInterval": "4 hours"

                });

                let PMaverageToBag = await canary.getProcessedData(credentials, {

                    "tags": ["GreenCreate.Kent.Flow.FT1711_Tot"],
                    "startTime": "12:00",
                    "endTime": "now",
                    "maxSize": 10,
                    "aggregateName": "Delta",
                    "aggregateInterval": "12 hours"

                });

                //console.log(averageToBag.data["GreenCreate.Kent.Flow.FT1711_Tot"][0].v)

                var BagTotaliser = (totalToBag.data["GreenCreate.Kent.Flow.FT1711_Tot"][0].v).toFixed(2);
                var BagAvg = (((averageToBag.data["GreenCreate.Kent.Flow.FT1711_Tot"][0].v)) / 4).toFixed(2);
                var PMBag = (PMaverageToBag.data["GreenCreate.Kent.Flow.FT1711_Tot"][0].v).toFixed(2);


                var hoursLeft = hoursUntilx(6);
                var hoursLeftPM = hoursUntilx(16);
                // console.log("hour left",hoursLeft);
                // AI Assistant
                var advice = "";
                var estimate = "";
                var sumMultiplier = 1;
                var line1 = "";


                // MASS BALANCE ADVICE
                if (

                    effPitTrend1 == "trending up" &&
                    effPitTrend2 == "trending up"
                ) {

                    advice =
                        "Effluent pit is " +
                        effPitTrend1 +
                        " on 2 and 4 hour trends, we estimate increased push forward to the bag for the next 8 hours.";

                    if (effPitLevel > 50) {
                        sumMultiplier = 1.5;
                    }
                }

                if (

                    effPitTrend1 == "a flat trend" &&
                    effPitTrend2 == "trending up"
                ) {
                    advice =
                        "Effluent pit is " +
                        effPitTrend1 +
                        " on 2 hours, but " +
                        effPitTrend2 +
                        " on 4 hour trend, we estimate a continued push forward to the bag for the next 8 hours.";

                    if (effPitLevel > 50) {
                        sumMultiplier = 1.25;
                    }
                }

                if (

                    effPitTrend1 == "a flat trend" &&
                    effPitTrend2 == "trending down"
                ) {
                    advice =
                        "Effluent pit is " +
                        effPitTrend1 +
                        " over 2 hours, but " +
                        effPitTrend2 +
                        " over a 4 hour trend, we estimate a decreased push forward to the bag for the next 8 hours.";

                    if (effPitLevel < 50) {
                        sumMultiplier = 0.8;
                    }
                }

                if (

                    effPitTrend1 == "trending down" &&
                    effPitTrend2 == "trending down"
                ) {
                    advice =
                        "Effluent pit is " +
                        effPitTrend1 +
                        " over the 2 hour and 4 hour trend, we estimate a large reduction in push forward to the bag for the next 8 hours.";
                    if (effPitLevel < 40) {
                        sumMultiplier = 0.4;
                    }
                }

                //ESTIMATES

                if (hours == 4) {
                    let sum = (parseInt(BagTotaliser) + (parseInt(BagAvg) * hoursLeft)).toFixed(1); // 0400 update
                    estimate = "*Estimated required out at 0600hrs; " + sum + "m3*";
                    line1 = `*` + BagTotaliser + `m3* sent to the bladder bag since 16:00.
                    `; 
                    log("0400 Estimate was triggered time sent was "+hours+" output : "+estimate,logfile)
                }

                if (hours == 15) {
                    let sum = ((parseInt(BagAvg) * hoursLeft)*sumMultiplier).toFixed(1); // 1500 update
                    estimate = "*Estimated required out at 0600hrs; " + sum + "m3*";
                    if (sum < 20){
                        sum = 60;
                    }
                    log("1500 Estimate was triggered time sent was "+hours+" output : "+estimate,logfile)
                }

                if (hours == 12) {
                    let sum = (parseInt(PMBag) + (parseInt(BagAvg) * hoursLeftPM)).toFixed(1);
                    estimate = "*Estimated required at 1600hrs (final loads required for day); " + sum + "m3*"; // midday update
                    log("1200 Estimate was triggered time sent was "+hours+" output : "+estimate,logfile)
                }

                let whatsAppBody =
                    ``+line1+`Current push forward is `+ BagAvg + `m3/hr. ` + advice + `. 

`+ estimate + `

Thanks! 

This message is transmitted at 0400hrs and 1200hrs, and 1500hrs.
`;


                try {
                    client.sendMessage(id, whatsAppBody);
                } catch (error) {
                    log(error, logfile);
                }

            }
        } else {
            console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
            log("Error in browseTags. Cannot proceed to getLiveDataToken.", logfile);
        }
    } catch (error) {
        console.error("Error:", error);
        log(error, logfile);
    }
};



function hoursUntilx(targetHour) {
    // Step 1: Get the current time
    const currentTime = new Date();

    // Step 2: Find the next target hour
    const nextTargetHour = new Date(currentTime);
    nextTargetHour.setHours(targetHour, 0, 0, 0);

    // If the next target hour is earlier than the current time, add one day
    if (currentTime >= nextTargetHour) {
        nextTargetHour.setDate(nextTargetHour.getDate() + 1);
    }

    // Step 3: Calculate the time difference in milliseconds
    const timeDifference = nextTargetHour - currentTime;

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference;
}


module.exports = fgs_update;
