require("dotenv").config({ path: "./process.env" });
const canary = require("canarylabs-web-api");
const email = require("../mailer"); // email.send(message, recipient, subject) all strings.
const helper = require("../tools/helpers");
const tagRefs = ["GREENCREATE.Wijster.GasTreatment.Tot_Gas_From_ADs", "GREENCREATE.Wijster.GasTreatment.FT-73-0001", "GREENCREATE.Wijster.Flare.FT-65-0001_PV" ,"GREENCREATE.Wijster.BUU.Collective.Biogas_to_BUU","GREENCREATE.Wijster.BUU.Collective.Biomethane_to_Grid"];  // Total = GREENCREATE.Wijster.GasTreatment.Tot_Gas_From_ADs ||| CHPS = GREENCREATE.Wijster.GasTreatment.FT-73-0001 ||| Flare = GREENCREATE.Wijster.Flare.FT-65-0001_PV  ||| Biogas to BUU = GREENCREATE.Wijster.BUU.Collective.Biogas_to_BUU   ||| Biomethane to grid = GREENCREATE.Wijster.BUU.Collective.Biomethane_to_Grid
const friendlyNames = ["Biogas (m3)", "CHPs (m3)", "Flare (m3)", "BUU (m3)","Grid (m3)"] // table names for each tag
// const startDates = ["08-01-2023","09-01-2023","10-01-2023","11-01-2023", "12-01-2023", "01-01-2024"]; // List of required dates here
// const endDates = ["09-01-2023","10-01-2023","11-01-2023","12-01-2023", "01-01-2024", "02-01-2024 06:00:00"]; // List of required dates here
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

const wijster_totalisers = async (startDates, endDates, emailAddress) => { // both arrays as per commented out const above
  try {
    let result = await canary.getUserToken(credentials, userTokenBody);

    let browseTagsResult = await canary.browseTags(credentials);

    if (browseTagsResult) {
      let liveDataResult = await canary.getLiveDataToken(credentials);

      if (liveDataResult) {
        console.log("Authorisation returned okay. Processing totals, this may take a while...");
        let resultArray = [];

        const totalItems = tagRefs.length * startDates.length;
        const progressBarLength = 50;
        const progressStep = totalItems / progressBarLength;
        let progress = 0;

        for (let i = 0; i < tagRefs.length; i++) {
          let tagRef = tagRefs[i];
          let name = friendlyNames[i];
          for (let i = 0; i < startDates.length; i++) {
            let startDate = startDates[i];
            let endDate = endDates[i];

            // console.log(`Processing ${startDate} for ${tagRef} . This may take a while...`)
            let tot = await canary.softTotalizer(credentials, {
              userToken: "{{UserToken}}",
              tags: [tagRef],
              startTime: startDate,
              endTime: endDate,
              maxSize: 10000000,
              aggregateName: "TimeAverage2",
              aggregateInterval: intervalTime
            });

            let result = {
              Ref: tagRef,
              Name: name,
              Total: tot,
              Period: `${startDate} to ${endDate}`,
              Accuracy: intervalTime
            };

            resultArray.push(result);
            // Update progress bar
            progress++;
            const percentage = Math.floor(progress / totalItems * 100);

            const barLength = Math.min((progressBarLength - 1), Math.floor(percentage / 100 * (progressBarLength - 1)));
            const progressBar = '[' + '='.repeat(barLength) + '>'.repeat(1) + ' '.repeat(progressBarLength - barLength - 1) + ']';
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Progress: ${percentage}% ${progressBar}`);

          }
        };
        process.stdout.write('\n');
        // Log all results after the for loop
       // resultArray.forEach(resultLine => console.log(resultLine));
       
        let table = helper.createTable(resultArray);

        try {
          email.send(table, emailAddress, "GC CoPilot Export"); // greencreatedata@outlook.com
        } catch (error) {
          console.log(error);
        }

      } else {
        console.log("Error in getLiveDataToken. Cannot proceed to processing totals.");
      }
    } else {
      console.log("Error in browseTags. Cannot proceed to getLiveDataToken.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


module.exports = wijster_totalisers;