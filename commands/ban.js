const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../utils")


module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the permission to Ban People")

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!target) return message.channel.send("Can't find user.");
    if (!target.bannable) return message.channel.send("The target is unbannable")
    if (target.hasPermission("BAN_MEMBERS")) return message.channel.send("I can't ban an admin")

    let targetIcon = target.user.avatarURL;
    let authorIcon = message.author.avatarURL;
    let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);

    if (!majorEventsChannel) message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

    args.shift();
    let reason = args.join(" ");
    if (!reason) return message.channel.send("You need a reason to ban someone");

    let embed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Banned!**`)
        .addField(`I have banned`, `${target.user}`)
        .addField(`On the behalf of`, `${message.author}`)
        .addField("For the reason", reason)
    utils.embedAddStamp(embed, message.author);


    let majorEventsEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**Ban**`)
        .addField("Banned User", `${target.user} with ID: ${target.user.id}`)
        .addField("Banned By", `${message.author} with ID: ${message.author.id}`)
        .addField("Ban Reason", reason)
        .addField("Ban Time", message.createdAt)
    utils.embedAddStamp(majorEventsEmbed, message.author);


    let pmEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Banned from the server "${message.guild.name}"**`)
        .addField("You got banned by", `${message.author}`)
        .addField("For the reason", reason)
        .addField("At", message.createdAt)
    utils.embedAddStamp(pmEmbed, message.author);



    target.user.send(pmEmbed);
    if (majorEventsChannel) majorEventsChannel.send(majorEventsEmbed);
    message.channel.send(embed);
    //timmeout for the pm to send
    setTimeout(() => {
        message.guild.member(target).ban();
    }, 2500);
}

module.exports.help = {
    name: "ban"
}