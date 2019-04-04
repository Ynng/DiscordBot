const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")

module.exports.run = async (bot, message, args) => {
  let serverIcon = message.guild.iconURL;

  let embed = new Discord.RichEmbed()
    .setTitle(`**Server Information**`)
    .setColor(`${config.embedColor}`)
    .setThumbnail(serverIcon)
    .addField("Server Name", message.guild.name)
    .addField("Server age", `${utils.getAgeString(utils.getAgeDate(message.guild.createdAt))}`)
    .addField("Total Members", message.guild.memberCount)
    .addField("Server Owner", message.guild.owner)
  utils.embedAddStamp(embed, message.author);
  message.channel.send(embed);
}

module.exports.help = {
  aliases: ["server", "serverinfo", "guildinfo"]
}