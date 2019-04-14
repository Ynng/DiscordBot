const Discord = require("discord.js");
const utils = require("../util/utils")


module.exports.run = async (bot, message) => {
    let result = Math.random() < 0.5;
    let embed = new Discord.RichEmbed();
    if (result) {
        embed.setTitle("Heads")
            .setColor("#fcd579")
            .setThumbnail("https://i.imgur.com/l1huIWw.png");
    } else {
        embed.setTitle("Tails")
            .setColor("#adffdf")
            .setThumbnail("https://i.imgur.com/JoOates.png");
    }
    utils.embedAddStamp(message, embed, message.author);
    message.channel.send(embed);
}

module.exports.help = {
    name: "coinflip",
    description: "Flip a coin, get either Heads or Tails randomly",
    aliases: ["coinFlip", "coin"]
}