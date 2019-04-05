'use strict';
//TODO: add tokens to git ignore before making the repo public

const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./botconfig.json");
const { token } = require("./tokens.json");

const fs = require("fs");

require("./util/eventHandler")(bot)

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Can't find comands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`)
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
    })
    console.log(`${f} loaded!`);
  })
  console.log(`Loaded ${jsfile.length} commands in total`)
}
);

bot.on("message", async message => {
  if (message.author.bot) return;
  // if(message.channel.type === "dm") return;

  var prefix = config.prefix;

  if (message.content.startsWith(prefix)) {
    var msg = message.content.substring(prefix.length).trim();
    var args = msg.split(" ");
    var cmd = args.shift();


    var commmandfile = bot.commands.get(bot.aliases.get(cmd));
    if (commmandfile) {
      console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);
      commmandfile.run(bot, message, args);
    }
  }
});

bot.login(token).catch(error => {
  console.log(error);
  console.log("Failed to Connect");
  return;
})
