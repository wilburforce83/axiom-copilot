
const helper = require("./tools/helpers");
const log = require('log-to-file');
const logfile = "log.txt";

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
    args: ['--no-sandbox'],
}
})

client.on('ready', () => {
    console.log('Client is ready, and already authorised!');
    
    (async () => {
        try {
          const chats = await client.getChats();
          // console.log(chats[5]);
          let chat = helper.filterArrayByString(chats,"Kent Ops (internal)");
          console.log(chat[0].id._serialized);
          let id = chat[0].id._serialized;
          // Now you can use the 'chats' variable in the rest of your code
         client.sendMessage(id, "This was sent by nodeJS");
        } catch (error) {
          console.error("Error fetching chats:", error);
          // Handle the error or log it as needed
        }
      })();
  
});

client.on("qr", async (qr) => {
		
    console.log("Whatsapp is asking for QR you are not authenticated");	
    log("Whatsapp is asking for QR you are not authenticated",logfile);	
    console.log(qr);	
    
});

client.initialize();




