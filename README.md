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
