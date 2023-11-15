const kent_update = require("./automated_updates/kent_update"); // trigger an Axiom email update for Kent





(async () => {
    await kent_update();
  })();
