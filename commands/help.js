const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    let botIcon = bot.user.displayAvatarURL;
    if (args[0]) {
        var targetCommand = args[0];

        // message.channel.send(utils.getHelpString(command));
    } else {

        var commandsArray = [];
        bot.commands.array().forEach(command => {
            commandsArray.push(command.help.name);
        });

        var embed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
            .setAuthor(`Help for ${bot.user.username}`,bot.user.displayAvatarURL)
            .addField("My commands:", `\`${commandsArray.join("\` \`")}\``)
            .addField("My prefix:", `\`${config.prefix}\``)
            .addField("Need help on the commands?", `\`\`\`html\n< ${config.prefix}help {command} >\`\`\``)

        utils.embedAddStamp(message, embed, message.author);
        message.channel.send(embed);
        return;
    }

    if (bot.commands.get(bot.aliases.get(targetCommand))) {
        command = bot.commands.get(bot.aliases.get(targetCommand));
        var pmEmbed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
        utils.embedAddStamp(message, pmEmbed, message.author);

        var dmAble = true;
        await message.author.send(utils.getHelpString(command)).catch(error => {
            console.log("Error, can't send dm to a user A")
            dmAble = false;
            utils.simpleError("I can't dm you, please change your settings or unblock me :disappointed_relieved: ", message, true)
        })
        if (message.channel.type != "dm") {
            message.author.send(pmEmbed).catch(error => {
                console.log("Error, can't send dm to a user B");
            });
            if (dmAble) {
                utils.simpleTemporary(":ok_hand:  Check your DMs!", message, config.embedColor)
            }
        }
    } else {
        utils.simpleError("I can't find that command :frowning2: ", message, true)
    }
}

module.exports.help = {
    name: "help",
    description: "DM you helpful infos on the given command, or just lists the commands and prefix",
    args: "[command name]",
    example: `kick`,
    aliases: ["help", "?", "h"]
}