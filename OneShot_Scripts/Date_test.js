const helper = require("../tools/helpers");
const dates = helper.generateDateObject(6, 'week')
const startDates = dates.startDates;
const endDates = dates.endDates;

console.log(startDates);
console.log(endDates);

