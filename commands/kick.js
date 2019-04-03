const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You don't have the permission to Kick People")

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!target) return message.channel.send("Can't find user.");
    if (!target.kickable) return message.channel.send("The target is unkickable")
    if (target.hasPermission("KICK_MEMBERS")) return message.channel.send("I can't kick an admin")

    let targetIcon = target.user.avatarURL;
    let authorIcon = message.author.avatarURL;
    let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);

    if (!majorEventsChannel) message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

    args.shift();
    let reason = args.join(" ");
    if (!reason) reason = "No Reason was Given";

    let embed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Kicked!**`)
        .addField(`I have kicked`, `${target.user}`)
        .addField(`On the behalf of`, `${message.author}`)
        .addField("For the reason", reason)
        .setFooter(`Requested by: ${message.author.username}`, authorIcon)
        .setTimestamp();

    let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(targetIcon)
        .setTitle(`**Kick**`)
        .addField("Kicked User", `${target.user} with ID: ${target.user.id}`)
        .addField("Kicked By", `${message.author} with ID: ${message.author.id}`)
        .addField("Kick Reason", reason)
        .addField("Kick Time", message.createdAt)
        .setFooter(`Requested by: ${message.author.username}`, authorIcon)
        .setTimestamp();


    let pmEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Kicked from the server "${message.guild.name}"**`)
        .addField("You got kicked by", `${message.author}`)
        .addField("For the reason", reason)
        .addField("At", message.createdAt)
        .setFooter(`Requested by: ${message.author.username}`, authorIcon)
        .setTimestamp();

    target.user.send(pmEmbed);
    if (majorEventsChannel)majorEventsChannel.send(majorEventsEmbed);
    message.channel.send(embed);
    //timmeout for the pm to send
    setTimeout(() => {
        message.guild.member(target).kick();
    }, 2500);
}

module.exports.help = {
    name: "kick"
}