const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    let botIcon = bot.user.displayAvatarURL;
    let botAge = new Date(Date.now() - bot.user.createdTimestamp);


    let botEmbed = new Discord.RichEmbed()
      .setTitle(`**${bot.user.username}'s Information**`)
      .setColor("#ff99e6")
      .setThumbnail(botIcon)
      .addField("My Name", bot.user.username)
      .addField("My Age", `${botAge.getFullYear() - 1970} Years, ${botAge.getMonth()} Months, ${botAge.getDate()} Days`)
      .addField("My Prefix", `\`${config.prefix}\``)


    message.channel.send(botEmbed);
}

module.exports.help = {
    name: "info"
}