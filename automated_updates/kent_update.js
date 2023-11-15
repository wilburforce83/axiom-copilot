require("dotenv").config({ path: "./process.env" });
const email = require("../mailer"); // email.send(message, recipient, subject) all strings.
const helper = require("../tools/helpers");
const canary = require("canarylabs-web-api"); // when using from npm use require('canarylabs-web-api')

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


    let tagDataResult = await canary.getRawData(credentials,{startTime : "Now - 2h", tags : "GreenCreate.Kent.Level.LT1230_PV"})

    var effPitTrend = helper.basicTrend(helper.extractValues(tagDataResult.data["GreenCreate.Kent.Level.LT1230_PV"]),5);

    // Check if browseTags was successful before calling getLiveDataToken
    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);

      if (liveDataResult) {
        let liveValues = await canary.getCurrentValues(credentials);
        var g2g = liveValues.data["GreenCreate.Kent.Elster.GEU_Grid"][0].v.toFixed(2);
        var biogasProduction = liveValues.data["GreenCreate.Kent.Flow.FT1200_PV"][0].v.toFixed(2);
        var CHPkwh = liveValues.data["GreenCreate.Kent.CHP.CHP_Act_Power"][0].v.toFixed(2);
        var d1pres = liveValues.data["GreenCreate.Kent.Pressure.PT1021_PV"][0].v.toFixed(2);
        var d2pres = liveValues.data["GreenCreate.Kent.Pressure.PT1022_PV"][0].v.toFixed(2);
        var digPress = liveValues.data["GreenCreate.Kent.Pressure.PT1200_PV"][0].v.toFixed(2);
        var combiPress = liveValues.data["GreenCreate.Kent.Pressure.PT1730_PV"][0].v.toFixed(2);


        let emailBody =
          `
        <p><span style=\"font-family: arial\"><strong>SITE UPDATE FROM AXIOM</strong></span><span style=\"color: rgb(61,142,185)\"><strong><br>\n<br>\n</strong></span><span style=\"color: rgb(61,142,185)\">Live data:<br>\n</span></p> <br>\n<ol>\n  <li><span style=\"color: rgb(61,142,185)\">
        G2G (m3/hr) =&nbsp;`+g2g+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">CHP (kWh) =&nbsp;` +
          Math.floor(CHPkwh) +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Biogas production (m3/hr) =&nbsp;` +
          Math.floor(biogasProduction) +
          `
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">D.1. and D.2. Feed pump pressure (bar) =&nbsp;`+d1pres+` / `+d2pres+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digester Pressure (mbar) =&nbsp;`+digPress+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Combi bag gas pressure (mbar) =&nbsp;`+combiPress+`
        </span></li>\n  <li><span style=\"color: rgb(61,142,185)\">Digestate pit level (% trending up or down?) =&nbsp;`+effPitTrend+`
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
