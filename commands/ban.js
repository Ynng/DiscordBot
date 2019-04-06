const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    if (utils.isDM(message)) return;
    if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleError("I don't have the permission to ban users", message, true);
    if (!message.member.hasPermission(this.help.permission)) return utils.simpleError("You don't have the permission to ban users", message, true);

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!target) return utils.simpleError("Can't find the user", message, true)
    if (target.hasPermission(this.help.permission)) return utils.simpleError("You can't ban an Admin", message, true);
    if (!target.bannable) return utils.simpleError("I can't ban this user", message, true);

    let targetIcon = target.user.avatarURL;
    let authorIcon = message.author.avatarURL;
    let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);

    args.shift();
    let reason = args.join(" ");
    if (!reason) return utils.simpleError("You need a reason to ban someone", message, true);
    
    if (!majorEventsChannel) utils.simpleError(`Can't find the Major-Events channel: "${config.majorEventsChannel}", detailed information about this ban won't be recorded`, message, false);
    
    let embed = new Discord.RichEmbed()
        .setColor(`${config.validColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Banned!**`)
        .addField(`I have banned`, `${target.user}`)
        .addField(`On the behalf of`, `${message.author}`)
        .addField("For the reason", reason)
    // utils.embedAddStamp(message, embed, message.author);


    let majorEventsEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**Ban**`)
        .addField("Banned User", `${target.user} with ID: ${target.user.id}`)
        .addField("Banned By", `${message.author} with ID: ${message.author.id}`)
        .addField("Ban Reason", reason)
        .addField("Ban Time", message.createdAt)
    // utils.embedAddStamp(message, majorEventsEmbed, message.author);


    let pmEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Banned from the server "${message.guild.name}"**`)
        .addField("You got banned by", `${message.author}`)
        .addField("For the reason", reason)
        .addField("At", message.createdAt)
    // utils.embedAddStamp(message, pmEmbed, message.author);



    target.user.send(pmEmbed).catch(error => {
        console.log("Error, can't send dm to a user");
    });
    if (majorEventsChannel) majorEventsChannel.send(majorEventsEmbed);
    message.channel.send(embed);
    //timmeout for the pm to send
    setTimeout(() => {
        // message.guild.member(target).ban();
    }, 2500);
}

module.exports.help = {
    name: "ban",
    args: "{@user} {Reason}",
    description: "Bans the targetted user from this server.",
    permission: "BAN_MEMBERS",
    example: "@xX_KoolGamer6903_Xx for being retarded",
    aliases: ["ban"]
}