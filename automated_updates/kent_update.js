require("dotenv").config({ path: "./process.env" });
const email = require("../mailer"); // email.send(message, recipient, subject) all strings.
const helper = require("../tools/helpers");
const kent_AI = require("./kent_ai");
const canary = require("canarylabs-web-api"); // when using from npm use require('canarylabs-web-api')
var tVal;

// API collection

const credentials = {
  username: process.env.MY_USERNAME || "default_username",
  password: process.env.MY_PASSWORD || "default_password",
  baseURL:
    process.env.MY_BASE_URL ||
    "https://yourdomain.canarylabs.online:55236/api/v2",
};

let userTokenBody = {
  application: "Web API",
  timezone: "Eastern Standard Time",
};

// Kent Module

const kent_update = async () => {
  try {
    let result = await canary.getUserToken(credentials, userTokenBody);
    console.log("user token", result.userToken);

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

    // get feed rate average 2 hour

    let frResult1 = await canary.getRawData(
      credentials,
      { startTime: "Now - 2h", tags: "GreenCreate.Kent.Flow.FT1021_PV" },
      null
    ); //return array of values for 2 hours

    let frResult2 = await canary.getRawData(
      credentials,
      { startTime: "Now - 2h", tags: "GreenCreate.Kent.Flow.FT1022_PV" },
      null
    ); //return array of values for 2 hours

    let frResult1Arr = helper.extractValues(
      frResult1.data["GreenCreate.Kent.Flow.FT1021_PV"]
    );
    let frResult2Arr = helper.extractValues(
      frResult2.data["GreenCreate.Kent.Flow.FT1022_PV"]
    );

    let decanterFr = await canary.getRawData(
      credentials,
      { startTime: "Now - 2h", tags: "GreenCreate.Kent.Flow.FT1701_PV" },
      null
    ); //return array of values for 2 hours

    let decanterFrArr = helper.extractValues(
      decanterFr.data["GreenCreate.Kent.Flow.FT1701_PV"]
    );

    let digesterFeed = helper.addArrays(frResult1Arr, frResult2Arr);

    let massDelta = helper.arrayDeltaComparator(digesterFeed, decanterFrArr);

    console.log("Mass Delta", massDelta);

    // Check if browseTags was successful before calling getLiveDataToken
    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);

      if (liveDataResult) {
        tVal = await canary.storeLatestValues(credentials);
        // console.log("tagValue", tVal);

        // let liveValues = await canary.getCurrentValues(credentials);
        var g2g = tVal["GreenCreate.Kent.Elster.GEU_Grid"].toFixed(2);
        var biogasProduction =
          tVal["GreenCreate.Kent.Flow.FT1200_PV"].toFixed(2);
        var CHPkwh = tVal["GreenCreate.Kent.CHP.CHP_Act_Power"].toFixed(2);
        var d1pres = tVal["GreenCreate.Kent.Pressure.PT1021_PV"].toFixed(2);
        var d2pres = tVal["GreenCreate.Kent.Pressure.PT1022_PV"].toFixed(2);
        var digPress = tVal["GreenCreate.Kent.Pressure.PT1200_PV"].toFixed(2);
        var combiPress = tVal["GreenCreate.Kent.Pressure.PT1730_PV"].toFixed(2);
        var decanterStatus = helper.returnStatus(
          tVal["GreenCreate.Kent.Flow.FT1701_PV"],
          8
        );
        var feedLoopStatus;

        if (
          (helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1021_PV"], 1) ==
            "yes" &&
            helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1022_PV"], 1) ==
              "yes") ||
          helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1001_PV"], 1) ==
            "yes"
        ) {
          feedLoopStatus = "yes";
        } else {
          feedLoopStatus = "no";
        }

        console.log("2h trend", effPitTrend1);
        console.log("4h trend", effPitTrend2);

        // AI Assistant
        var advice = "";
        var advice2 = "";
        var advice3 = "";

        // MASS BALANCE ADVICE
        if (
          massDelta.delta > 0 &&
          effPitTrend1 == "trending up" &&
          effPitTrend2 == "trending up"
        ) {
          advice =
            "Effluent pit is " +
            effPitTrend1 +
            " on 2 and 4 hour trends, mass delta across the digesters shows a " +
            massDelta.info +
            " feed pumps and decanter of " +
            Math.floor(massDelta.delta) +
            "m3/hr. Recommendation to increase the decanter by " +
            Math.floor(massDelta.delta) +
            "m3/hr, if possible to balance the flowrate, or " +
            Math.floor(massDelta.delta + 0.5) +
            "m3/hr to slowly bring the effluent pit level down.";
        }

        if (
          massDelta.delta > 0 &&
          effPitTrend1 == "a flat trend" &&
          effPitTrend2 == "trending up"
        ) {
          advice =
            "Effluent pit is " +
            effPitTrend1 +
            " on 2 hours, but " +
            effPitTrend2 +
            " on 4 hour trend, delta across the digesters shows a " +
            massDelta.info +
            " feed pumps and decanter of " +
            Math.floor(massDelta.delta) +
            "m3/hr. Consider to increasing the decanter by " +
            Math.floor(massDelta.delta) +
            "m3/hr, unless you are intentionally holding liquids in the effluent pit.";
        }

        if (
          massDelta.delta < 0 &&
          effPitTrend1 == "a flat trend" &&
          effPitTrend2 == "trending down"
        ) {
          advice =
            "Effluent pit is " +
            effPitTrend1 +
            " over 2 hours, but " +
            effPitTrend2 +
            " over a 4 hour trend, delta across the digesters shows a " +
            massDelta.info +
            " feed pumps and decanter of " +
            Math.floor(massDelta.delta) +
            "m3/hr. Recommendation to decrease the decanter by " +
            Math.floor(massDelta.delta) +
            "m3/hr, if possible to balance the flowrate, or " +
            Math.floor(massDelta.delta + 0.5) +
            "m3/hr to slowly allow the effluent pit to rise.";
        }

        if (
          massDelta.delta < 0 &&
          effPitTrend1 == "trending down" &&
          effPitTrend2 == "trending down"
        ) {
          advice =
            "Effluent pit is " +
            effPitTrend1 +
            " over the 2 hour and 4 hour trend, delta across the digesters shows a " +
            massDelta.info +
            " feed pumps and decanter of " +
            Math.floor(massDelta.delta) +
            "m3/hr. Consider to decreasing the decanter by " +
            Math.floor(massDelta.delta) +
            "m3/hr, unless you are intentionally lowering the level in the effluent pit.";
        }

        // FEED PRESSURE ADVICE

        if (
          helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1021_PV"], 1) ==
            "yes" &&
          helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1022_PV"], 1) ==
            "yes" &&
          (d1pres > 4 || d2pres > 4)
        ) {
          advice2 =
            "One or more digester feed pressure is running over 4 bar. Consider lowering feed rate or increasing dilution to keep feed DS% consistent";
        }

        if (
          helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1021_PV"], 1) ==
            "yes" &&
          helper.returnStatus(tVal["GreenCreate.Kent.Flow.FT1022_PV"], 1) ==
            "yes" &&
          (d1pres < 0.75 || d2pres > 0.75)
        ) {
          advice2 =
            "One or more digester feed pressure is running below 0.75 bar. Consider increasing feed rate or lowering dilution to keep feed DS% consistent";
        }

        var intro = "";

        if (advice !== "" || advice2 !== "" || advice3 !== "") {
          intro = "GC Copilot;"
        }

        let emailBody =
          `
        <p><span style=\"font-family: arial\"><strong></strong></span><span style=\"color: rgb(61,142,185)\"><strong><br>\n<br>\n</strong></span><span style=\"color: rgb(61,142,185)\">Site Live data:<br>\n</span></p> <br>\n<ol>\n  <li><span style=\"color: rgb(61,142,185)\">
        G2G (m3/hr) =&nbsp;` +
          g2g +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">CHP (kWh) =&nbsp;` +
          CHPkwh +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Biogas production (m3/hr) =&nbsp;` +
          biogasProduction +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">D.1. and D.2. Feed pump pressure (bar) =&nbsp;` +
          d1pres +
          ` / ` +
          d2pres +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digester Pressure (mbar) =&nbsp;` +
          digPress +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Combi bag gas pressure (mbar) =&nbsp;` +
          combiPress +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digestate pit level (% trending up or down?) =&nbsp;` +
          effPitTrend1 +
          ` (2h) , ` +
          effPitTrend2 +
          ` (4h)
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Feed loop running? (Y/N) ` +
          feedLoopStatus +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Decanter running (Y/N) ` +
          decanterStatus +
          `
        </span></li>\n</ol>\n<br>\n</strong>`+intro+`</span><span style=\"color: rgb(61,142,185)\">
        
         ` +
          advice +
          `<br><br>` +
          advice2 +
          `<br><br>` +
          advice3 +
          `<br><br>` +
          `
        
        <br>\n</span></p>\n

        `;

        email.send(emailBody, "greencreatedata@outlook.com", "Kent Axiom Update");
      }
    } else {
      console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = kent_update;
