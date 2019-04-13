const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")

module.exports.run = async (bot, message) => {
  if (utils.isDM(message)) return;

  let serverIcon = message.guild.iconURL;

  let embed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(serverIcon)
    .setTitle(`Server Information`)
    .addField("You are currently in", message.guild.name, true)
    .addField("Owned by", message.guild.owner, true)
    .addField("It has existed for", `${utils.getAgeString(utils.getAgeDate(message.guild.createdAt))}`, true)
    .addField("With a population of", message.guild.memberCount)
  utils.embedAddStamp(message, embed, message.author);
  message.channel.send(embed);
}

module.exports.help = {
  name: "serverinfo",
  description: "This displays some information on the current server",
  aliases: ["server", "serverinfo", "guildinfo"]
}