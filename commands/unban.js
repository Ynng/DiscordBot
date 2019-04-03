const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the permission to unban People")

    let targetID = args[0];
    if (!targetID) return message.channel.send("Please enter a user ID");

    let target = message.guild.members.get(targetID);
    if (!target) return message.channel.send("Can't find user, Please enter a valid user ID");

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
        .setTitle(`**@${target.user.username} Just Got Unbanned!**`)
        .addField(`I have unbanned`, `${target.user}`)
        .addField(`On the behalf of`, `${message.author}`)
        .addField("For the reason", reason)
        .setFooter(`Requested by: ${message.author.username}`, authorIcon)
        .setTimestamp();

    let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(targetIcon)
        .setTitle(`**Unban**`)
        .addField("Unbanned User", `${target.user} with ID: ${target.user.id}`)
        .addField("Unbanned By", `${message.author} with ID: ${message.author.id}`)
        .addField("Unbanned Reason", reason)
        .setFooter(`Requested by: ${message.author.username}`, authorIcon)
        .setTimestamp();

    // let pmEmbed = new Discord.RichEmbed()
    //     .setColor("#ff99e6")
    //     .setThumbnail(authorIcon)
    //     .setTitle(`**You Just Got Banned from the server "${message.guild.name}"**`)
    //     .addField("You got banned by", `${message.author}`)
    //     .addField("For the reason", reason)
    //     .addField("At", message.createdAt);


    // target.user.send(pmEmbed);
    if (majorEventsChannel)majorEventsChannel.send(majorEventsEmbed);
    message.channel.send(embed);
    message.guild.unban(targetID);

    //timmeout for the pm to send
    // setTimeout(() => {
    //     message.guild.member(target).ban();
    // }, 2500);
}

module.exports.help = {
    name: "unban"
}