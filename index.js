'use strict';
//TODO: add tokens to git ignore before making the repo public

const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./botconfig.json");
const { token } = require("./tokens.json");

const fs = require("fs");

bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files)=>{
  if(err) console.log(err);
  
  let jsfile = files.filter(f=>f.split(".").pop()==="js");
    if(jsfile.length <= 0){
      console.log("Can't find comands.");
      return;
    }

    jsfile.forEach((f,i)=>{
      let props = require(`./commands/${f}`)
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    })
  }
);

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity(`for the prefix: ${config.prefix}`, { type: "WATCHING" })
    .then(presence => console.log(`Activity set to "${presence.game ? presence.game.name : "none"}"`))
    .catch(console.error);
});

bot.on("message", async message => {
  if (message.author.bot) return;
  // if(message.channel.type === "dm") return;

  var prefix = config.prefix;

  if (message.content.startsWith(prefix)) {
    var msg = message.content.substring(prefix.length).trim();
    var args = msg.split(" ");
    var cmd = args.shift();

    console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);

    var commmandfile = bot.commands.get(cmd);
    if(commmandfile) commmandfile.run(bot,message,args);

  }
});

bot.login(token).catch(error => {
  console.log(error);
  console.log("Failed to Connect");
  return;
})
