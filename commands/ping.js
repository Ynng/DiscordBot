const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    console.log("works");
    message.channel.send("pong!");
}

module.exports.help = {
    name: "ping"
}