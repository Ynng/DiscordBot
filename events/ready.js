const Discord = require("discord.js")
const config = require("../botconfig.json");


module.exports = bot =>{
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity(`for the prefix: ${config.prefix}`, { type: "WATCHING" })
      .then(presence => console.log(`Activity set to "${presence.game ? presence.game.name : "none"}"`))
      .catch(console.error);
}