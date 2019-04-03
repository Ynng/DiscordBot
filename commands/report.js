const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {    
    let reportedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!reportedUser) return message.channel.send("Couldn't find user.");

    let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);
    if (!majorEventsChannel) return message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

    args.shift();
    let reason = args.join(" ");
    if (!reason) return message.channel.send("Please Provide a reason for the report");

    let reportedUserIcon = reportedUser.user.avatarURL;

    let reportPublicEmbed = new Discord.RichEmbed()
      .setColor("#ff99e6")
      .setThumbnail(reportedUserIcon)
      .setTitle(`**@${reportedUser.user.username} Just Got Reported!**`)
      .addField("I have reported", reportedUser.user)
      .addField("On the behalf of", message.author)
      .addField("For the reason", reason)


    let majorEventsEmbed = new Discord.RichEmbed()
      .setColor("#ff99e6")
      .setThumbnail(reportedUserIcon)
      .setTitle(`**@${reportedUser.user.username} Got Reported!**`)
      .addField("Reported User", `${reportedUser.user} with ID: ${reportedUser.user.id}`)
      .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
      .addField("Report Reason", reason)
      .addField("Report Time", message.createdAt);



    majorEventsChannel.send(majorEventsEmbed);
    message.channel.send(reportPublicEmbed);
}

module.exports.help = {
    name: "report"
}