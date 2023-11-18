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

const kent_pondWater = async () => {
  try {
    let result = await canary.getUserToken(credentials, userTokenBody);
    console.log("user token", result.userToken);

    // Make sure browseTags returns a promise
    const browseTagsResult = await canary.browseTags(credentials);

   // console.log("tag result",browseTagsResult)

    let pondResult = await canary.getRawData(
      credentials,
      { startTime: "Now - 3h", tags: "GreenCreate.Kent.Flow.FT1731_PV" },
      null
    ); //return array of values for 2 hours

   // console.log("pond",pondResult)

    let pondArr = helper.extractValues(
      pondResult.data["GreenCreate.Kent.Flow.FT1731_PV"]
    );

   // console.log("Pond water", pondArr);
   // console.log("entries", pondArr.length)
    
    var sum = 0;

// Iterate through the array and add each element to the sum
for (var i = 0; i < pondArr.length; i++) {
    sum += pondArr[i];
}

pondResultFinal = helper.calculateTotalVolume(pondArr);

// console.log("sum of pond", pondResultFinal)

let timeRunning = helper.calculateTimeAboveThreshold(pondArr,1)

let runTime = (timeRunning.timeRunning/timeRunning.elapsedTime).toFixed(2)*100;

    let emailBody =
      `
        <p><span style=\"font-family: arial\"><strong></strong></span><span style=\"color: rgb(61,142,185)\"><strong><br>\n<br>\n</strong></span><span style=\"color: rgb(61,142,185)\">Site Pond data:<br>\n</span></p> <br>\n<ol>\n  <li><span>
        PU1731 (m3 over last 3hrs) =&nbsp;` +
      pondResultFinal.volume +
      `
        </span></li>\n 
        <br>\n</span>The dilution pumps were running `+runTime+`% of the time over this period.</p>\n

        `;

    email.send(emailBody, "greencreatedata@outlook.com", "Kent Pond Update"); // greencreatedata@outlook.com
  }

  catch (error) {
    console.error("Error:", error);
  };
};


  module.exports = kent_pondWater;

  kent_pondWater(); // comment out after testing
