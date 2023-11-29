const kent_update = require("./automated_updates/kent_update"); // trigger an Axiom email update for Kent
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