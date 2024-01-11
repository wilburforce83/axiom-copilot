require("dotenv").config({ path: "./process.env"});
const canary = require("canarylabs-web-api");

const tagRef = "GREENCREATE.Wijster.GasTreatment.FT-73-0001";  // CHPS = GREENCREATE.Wijster.GasTreatment.FT-73-0001 ||| Flare = GREENCREATE.Wijster.Flare.FT-65-0001_PV
const startDates = ["10-01-2023", "11-01-2023", "12-01-2023"]; // List of required dates here
const endDates = ["11-01-2023","12-01-2023", "01-01-2024"]; // List of required dates here
const intervalTime = "10 seconds";

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

(async () => {
  try {
    let result = await canary.getUserToken(credentials, userTokenBody);

    let browseTagsResult = await canary.browseTags(credentials);

    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);

      if (liveDataResult) {
        console.log("Authorisation returned okay. Processing totals, this may take a while...");
        let resultArray = [];
        for (let i = 0; i < startDates.length; i++) {
          let startDate = startDates[i];
          let endDate = endDates[i];
console.log("Processing "+startDate+". This make take a while")
          let tot = await canary.softTotalizer(credentials, {
            userToken: "{{UserToken}}",
            tags: [tagRef],
            startTime: startDate,
            endTime: endDate,
            maxSize: 10000000,
            aggregateName: "TimeAverage2",
            aggregateInterval: intervalTime
          });

          resultArray.push(`Response; TAG: ${tagRef}, ${tot} m3, Between ${startDate} and ${endDate}`);
        }
         // Log all results after the for loop
         resultArray.forEach(resultLine => console.log(resultLine));

      } else {
        console.log("Error in getLiveDataToken. Cannot proceed to processing totals.");
      }
    } else {
      console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
