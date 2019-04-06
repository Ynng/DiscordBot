const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
        .setTitle(":thinking:  pinging....")
        .setColor(config.embedColor)
    utils.embedAddStamp(message, embed, message.author);
    message.channel.send(embed).then(msg => {
        msg.edit(embed.setTitle(`:ping_pong: pong! ${msg.createdTimestamp - message.createdTimestamp}ms`).setColor(config.validColor));
    })
}

module.exports.help = {
    name: "ping",
    description: "Calculates the current ping of the bot, me!",
    aliases: ["ping", "p"]
}