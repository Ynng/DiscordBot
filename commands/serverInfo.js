const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    let serverIcon = message.guild.iconURL;
    let serverAge = new Date(Date.now() - message.guild.createdTimestamp);

    let serverEmbed = new Discord.RichEmbed()
      .setTitle(`**Server Information**`)
      .setColor("#ff99e6")
      .setThumbnail(serverIcon)
      .addField("Server Name", message.guild.name)
      .addField("Server age", `${serverAge.getFullYear() - 1970} Years, ${serverAge.getMonth()} Months, ${serverAge.getDate()} Days`)
      .addField("Total Members", message.guild.memberCount)
      .addField("Server Owner", message.guild.owner)

    message.channel.send(serverEmbed);
}

module.exports.help = {
    name: "server"
}