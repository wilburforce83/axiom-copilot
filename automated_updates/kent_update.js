require("dotenv").config({ path: "./process.env" });
const email = require("../mailer"); // email.send(message, recipient, subject) all strings.
const helper = require("../tools/helpers");
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


    // Make sure browseTags returns a promise
    let browseTagsResult = await canary.browseTags(credentials);


    let effPitResult1 = await canary.getRawData(credentials,{startTime : "Now - 2h", tags : "GreenCreate.Kent.Level.LT1230_PV"}) //return array of values for 2 hours
    let effPitResult2 = await canary.getRawData(credentials,{startTime : "Now - 4h", tags : "GreenCreate.Kent.Level.LT1230_PV"}) //return array of values for 2 hours
    var effPitTrend1 = helper.basicTrend(helper.extractValues(effPitResult1.data["GreenCreate.Kent.Level.LT1230_PV"]),5);
    var effPitTrend2 = helper.basicTrend(helper.extractValues(effPitResult1.data["GreenCreate.Kent.Level.LT1230_PV"]),5);

    // Check if browseTags was successful before calling getLiveDataToken
    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);

      if (liveDataResult) {

        tVal = await canary.storeLatestValues(credentials);
        console.log("tagValue",tVal);

        
       // let liveValues = await canary.getCurrentValues(credentials);
        var g2g = tVal["GreenCreate.Kent.Elster.GEU_Grid"].toFixed(2);
        var biogasProduction = tVal["GreenCreate.Kent.Flow.FT1200_PV"].toFixed(2);
        var CHPkwh = tVal["GreenCreate.Kent.CHP.CHP_Act_Power"].toFixed(2);
        var d1pres = tVal["GreenCreate.Kent.Pressure.PT1021_PV"].toFixed(2);
        var d2pres = tVal["GreenCreate.Kent.Pressure.PT1022_PV"].toFixed(2);
        var digPress = tVal["GreenCreate.Kent.Pressure.PT1200_PV"].toFixed(2);
        var combiPress = tVal["GreenCreate.Kent.Pressure.PT1730_PV"].toFixed(2);


        let emailBody =
          `
        <p><span style=\"font-family: arial\"><strong>SITE UPDATE FROM AXIOM</strong></span><span style=\"color: rgb(61,142,185)\"><strong><br>\n<br>\n</strong></span><span style=\"color: rgb(61,142,185)\">Live data:<br>\n</span></p> <br>\n<ol>\n  <li><span style=\"color: rgb(61,142,185)\">
        G2G (m3/hr) =&nbsp;`+g2g+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">CHP (kWh) =&nbsp;` +
          CHPkwh +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Biogas production (m3/hr) =&nbsp;` +
          biogasProduction +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">D.1. and D.2. Feed pump pressure (bar) =&nbsp;`+d1pres+` / `+d2pres+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digester Pressure (mbar) =&nbsp;`+digPress+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Combi bag gas pressure (mbar) =&nbsp;`+combiPress+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digestate pit level (% trending up or down?) =&nbsp;`+effPitTrend1+` (2h) , `+effPitResult2+` (4h)
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Feed loop running? (Y/N)
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">AR running (Y/N)
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Decanter running (Y/N)
        </span></li>\n</ol>\n<br>\n</strong></span><span style=\"color: rgb(61,142,185)\">Thank you, team!<br>\n</span></p>\n

        `;

        email.send(emailBody, "will@green-create.com", "Axiom testing")

      }
    } else {
      console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = kent_update;
