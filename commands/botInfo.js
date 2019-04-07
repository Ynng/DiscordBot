const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")

module.exports.run = async (bot, message) => {
  let botIcon = bot.user.displayAvatarURL;

  let embed = new Discord.RichEmbed()
    .setTitle(`**${bot.user.username}'s Information**`)
    .setColor(`${config.embedColor}`)
    .setThumbnail(botIcon)
    .addField("My Name", bot.user.username)
    .addField("My Age", `${utils.getAgeString(utils.getAgeDate(bot.user.createdAt))}`)
    .addField("My Prefix", `\`${config.prefix}\``)
  utils.embedAddStamp(message, embed, message.author);


  message.channel.send(embed);
}

module.exports.help = {
  name:"botinfo",
  description:"This displays some information on the bot, me!",
  aliases: ["info", "botinfo", "bot", "stats", "stat"]
}