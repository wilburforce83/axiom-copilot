require("dotenv").config({ path: "./process.env" });
const canary = require("canarylabs-web-api"); // when using from npm use require('canarylabs-web-api')

// Basic running example

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

// Example usage:

(async () => {
  try {
    let result = await canary.getUserToken(credentials, userTokenBody);
    console.log("User Token : " + result.userToken);
  } catch (error) {
    console.error("Error:", error);
  }
})();

// Wait until API access is opened up and see what we can do!
