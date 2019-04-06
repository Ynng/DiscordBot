const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    utils.simplePermanent(":ping_pong: pong", message, config.embedColor);
}

module.exports.help = {
    name: "ping",
    description: "funz",
    aliases: ["ping"]
}