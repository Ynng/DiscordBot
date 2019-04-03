const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../useful/utils")


module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
        .setTitle(":ping_pong: pong")
        .setColor(`${config.embedColor}`)
    utils.embedAddStamp(embed, message.author);

    message.channel.send(embed);
}

module.exports.help = {
    name: "ping"
}