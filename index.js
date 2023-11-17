const kent_update = require("./automated_updates/kent_update"); // trigger an Axiom email update for Kent




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
    }, 60000);
  }
  // Start checking for specific times
  runKentUpdates();