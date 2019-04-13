const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    if (args[0]) {
        var targetCommand = args[0];
    } else {
        var commandsArray = [];
        bot.commands.array().forEach(command => {
            commandsArray.push(command.help.name);
        });

        var embed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
            .setAuthor(`Help for ${bot.user.username}`, bot.user.displayAvatarURL)
            .addField("My commands:", `\`${commandsArray.join("\` \`")}\``)
            .addField("My prefix:", `\`${config.prefix}\``)
            .addField("Need help on the commands?", `\`\`\`html\n< ${config.prefix}help {command} >\`\`\``)

        utils.embedAddStamp(message, embed, message.author);
        message.channel.send(embed);
        return;
    }

    if (bot.commands.get(bot.aliases.get(targetCommand))) {
        var command = bot.commands.get(bot.aliases.get(targetCommand));
        var pmEmbed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
        utils.embedAddStamp(message, pmEmbed, message.author);

        if (message.channel.type != "dm") {
            var dmAble = true;
            await message.author.send(utils.getHelpString(command)).catch(() => {
                console.log("Error, can't send dm to a user")
                dmAble = false;
                utils.simpleMessage(":frowning2: I can't dm you, please change your settings or unblock me", message, config.errorColor, config.tempTime);
            })
            if (dmAble) {
                message.author.send(pmEmbed).catch(() => {
                    // console.log("Error, can't send dm to a user B");
                });
                utils.simpleMessage(":ok_hand: Check your DMs!", message, config.embedColor, config.tempTime);
            }
        } else {
            message.author.send(pmEmbed);
        }
    } else {
        utils.simpleMessage(":frowning2: I can't find that command, do `!help` to get a list of available commands", message, config.errorColor, config.tempTime)
    }
}

module.exports.help = {
    name: "help",
    description: "DM you helpful infos on the given command, or just lists the commands and prefix",
    args: "[command name]",
    example: `kick`,
    aliases: ["help", "?", "h"]
}