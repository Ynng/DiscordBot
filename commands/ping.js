const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    message.channel.send("pong");
}

module.exports.help = {
    name: "ping"
}