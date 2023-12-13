const kent_update = require("./automated_updates/kent_update");
const fgs_update = require("./automated_updates/fgs_update"); // trigger an Axiom email update for Kent
const kent_pondWater = require("./automated_updates/kent_pondWater"); // trigger an Axiom email update for Kent

console.log(
  `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%///@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@/////*@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@&//////*/#@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@(///////*///@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@&///////*///@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@&/(@//////*/%&//@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@///*/@#*///*@(/*//#@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@%///////%@///&////////@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@///////////@@%*/////////%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@///////////#@//*//////////(@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@/*///////*//@(///*///////*////@@@@@@@@@@@@@@@
@@@@@@@@@@@@@&////////////@/////*//////////////@@@@@@@@@@@@@
@@@@@@@@@@@@////*///////&&//////*///////////////@@@@@@@@@@@@
@@@@@@@@@@@////////////@////////*////////////////%@@@@@@@@@@
@@@@@@@@@%*/*/*/*/*/*&@/*/*/*/*/*/*/*/*/*/*/*/*/*/*@@@@@@@@@
@@@@@@@@////////////@(//////////*///////////////////#@@@@@@@
@@@@@@@/////////*/#@////////////*///////////////*/////@@@@@@
@@@@@(///////////@%/////////////*//////////////////////@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Author Will Shearer 2023 - Green Create, GC CoPilot AI v1.0

...Starting.
  `
)


function runKentUpdates() {
    const targetHours = [0, 4, 8, 12, 16, 20];
    let lastTriggeredHour = -1;
  
    setInterval(() => {
      const currentHour = new Date().getHours();
  
      if (targetHours.includes(currentHour) && lastTriggeredHour !== currentHour) {
        console.log(`Triggering action at ${new Date()}`);
        (async () => {
          await kent_update();
        })();
    
        lastTriggeredHour = currentHour;
      } else {
        console.log(`Not a triggering time: ${new Date()}`);
      }
    }, 120000);
  }
  // Start checking for specific times
  runKentUpdates();


  /*
  function runEveryThreeHours() {
    const intervalInMilliseconds = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  
    // Run the function initially
    kent_pondWater();
  
    // Set up the recurring interval
    setInterval(async () => {
      await kent_pondWater();
    }, intervalInMilliseconds);
  }
  
  // Start the recurring function
  runEveryThreeHours();

  */

  function scheduleFunction() {
    // Get the current time
    var now = new Date();
    
    // Calculate the time until the next 04:00, 12:00, or 20:00
    var hours = now.getHours();
    var nextRun;
    
    if (hours < 4) {
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0);
    } else if (hours < 12) {
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
    } else if (hours < 15) {
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0);
    } else {
      // If it's already past 20:00, schedule it for the next day at 04:00
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 4, 0, 0, 0);
    }
  
    // Calculate the time until the next run
    var timeUntilNextRun = nextRun - now;
  
    // Set a timeout to run the function at the scheduled time
    setTimeout(function () {
      fgs_update(hours);
  
      // Schedule the function to run again at the next interval
      scheduleFunction();
    }, timeUntilNextRun);
  }

  // Start the scheduling
scheduleFunction();