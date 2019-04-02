'use strict';
//TODO: add tokens to git ignore before making the repo public

const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./botconfig.json");
const {token} = require("./tokens.json");



bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("With my ご主人様", { type: "PLAYING" })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : "none"}`))
    .catch(console.error);
});

bot.on("message", async message => {
  if (message.author.bot) return;
  // if(message.channel.type === "dm") return;

  let prefix = config.prefix;

  if (message.content.startsWith(prefix)) {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


    console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);

    if (cmd === `${prefix}ping`) {
      message.channel.send("pong!");
    }
  }
});

bot.login(token).catch(error=>{
  console.log(error);
  console.log("Failed to Connect");
  return;
})
