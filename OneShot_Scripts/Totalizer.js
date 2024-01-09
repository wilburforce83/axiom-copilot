require("dotenv").config({ path: "./process.env" });
const canary = require("canarylabs-web-api"); // when using from npm use require('canarylabs-web-api')

// Basic Totalizer script:

const tagRef = "GREENCREATE.Wijster.BUU.Collective.Biogas_to_BUU"; // exclude [] from tag reference.
const startDate = "11-01-2023"; // mm-dd-yyyy date or semantic time e.g. now - 1 month/week/day etc
const endDate = "12-01-2023";
const intervalTime = "10 seconds"; // seconds, minutes, hours, days, weeks etc.






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
   // console.log("getusertoken", result);

    // Make sure browseTags returns a promise
    let browseTagsResult = await canary.browseTags(credentials);
   // console.log("Browse tags", browseTagsResult);
    // Check if browseTags was successful before calling getLiveDataToken
    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);
     // console.log("Live Data Result", liveDataResult);
      if (liveDataResult) {
       // Actual function

       // Dates should be mm-dd-yyy
    console.log("Authorisation returned okay. Processing totals, this may take a while...")
       let tot = await canary.softTotalizer(credentials, {

        "userToken": "{{UserToken}}",
        "tags": [tagRef],
        "startTime": startDate,
        "endTime": endDate,
        "maxSize": 10000000,
        "aggregateName": "TimeAverage2",
        "aggregateInterval": intervalTime

    });

    console.log("response; TAG: ",tagRef,tot,"m3", "Between "+startDate+" and "+endDate);

  };

    } else {
      console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
