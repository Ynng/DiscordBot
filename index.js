'use strict';
//TODO: add tokens to git ignore before making the repo public

const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./botconfig.json");

const { token } = require("./tokens.json");

const fs = require("fs");

require("./util/eventHandler")(bot)

const commandHandler = require("./util/commandHandler");



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

  commandHandler(bot, message);
});

bot.login(token).catch(error => {
  console.log(error);
  console.log("Failed to Connect");
  return;
})
