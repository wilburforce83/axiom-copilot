## Installation

Requires node 8 + to run.

`git clone https://github.com/wilburforce83/axiom-copilot.git`

then;

`cd axiom-copilot`

then;

`npm install`

## Usage

#### Environmental Variables

For the app to run you will to add you own `process.env` file into the `root directory` . 

contents should be like this;

``` .env
MY_USERNAME=yourusername
MY_PASSWORD=yourpassword
MY_BASE_URL=https://yourdomain.canarylabs.online:55236/api/v2
EMAIL_SERVER=mail.domain.com
EMAIL_PORT=465
EMAIL_ADDRESS=youremail@domain.com
EMAIL_PASSWORD=youremailpassword
ALERT_RECIPIENT=yourrecipient@theirdomain.com
```

#### Starting the app

`cd` to /axiom-copilot if not already there. Then;

`npm start` or `node run app.js`

## Running as an executable file


### Compiling to single file

compiling to `/dist` 

Install `ncc`

`npm install -g ncc`

Then run;

`ncc build app.js -o dist`

then;

`cd dist`

then

`npm install -g pkg`

then;

`pkg -t node18-win-x64 -o copilot-pkg.exe index.js`

### Caviats

The .exe file requires the nodeJS files to be kept in the same sub folder for it to run as an executable file.
