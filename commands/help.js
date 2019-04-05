const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    let botIcon = bot.user.displayAvatarURL;
    if (args[0]) {
        var targetCommand = args[0];

        // message.channel.send(utils.getHelpString(command));
    } else {
        return message.channel.send(utils.getCommandsNameArray(bot));
    }

    if (bot.commands.get(bot.aliases.get(targetCommand))) {
        command = bot.commands.get(bot.aliases.get(targetCommand));
        //if I put this on seperate lines, discord freaks out
        // var embed = new Discord.RichEmbed()
        //     .setColor(`${config.embedColor}`)
        //     .setAuthor(`${bot.user.username} Help`, botIcon)
        //     .addField(`"${command.help.name}" Command Help`, utils.getHelpString(command))
        // utils.embedAddStamp(embed, message.author);
        message.author.send(utils.getHelpString(command));
        var pmEmbed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
        utils.embedAddStamp(pmEmbed, message.author);
        message.author.send(pmEmbed);

        if (message.channel.type != "dm") {
            var publicEmbed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
            .setTitle(":ok_hand:  Check your DMs!")
            utils.embedAddStamp(publicEmbed, message.author);
            message.channel.send(publicEmbed);
        }

    } else {
        var embed = new Discord.RichEmbed()
            .setColor(`${config.embedColor}`)
            .setTitle(":no_entry_sign:  I can't find that command :(")
        utils.embedAddStamp(embed, message.author);
        message.channel.send(embed);
    }
}

module.exports.help = {
    name: "help",
    description: "This displays some information on a specific commmand",
    args: "{command name}",
    example: `kick`,
    aliases: ["help", "?", "h"]
}