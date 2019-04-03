const Discord = require("discord.js");
const config = require("../botconfig.json");


module.exports.run = async (bot, message, args) => {
  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!target) return message.channel.send("Can't find user.");

  let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);
  if (!majorEventsChannel) return message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

  args.shift();
  let reason = args.join(" ");
  if (!reason) return message.channel.send("You **NEED** a reason to report someone");

  let targetIcon = target.user.avatarURL;
  let authorIcon = message.author.avatarURL;

  let reportPublicEmbed = new Discord.RichEmbed()
    .setColor("#ff99e6")
    .setThumbnail(targetIcon)
    .setTitle(`**@${target.user.username} Just Got Reported!**`)
    .addField("I have reported", target.user)
    .addField("On the behalf of", message.author)
    .addField("For the reason", reason)
    .setFooter(`Requested by: ${message.author.username}`, authorIcon)
    .setTimestamp();


  let majorEventsEmbed = new Discord.RichEmbed()
    .setColor("#ff99e6")
    .setThumbnail(targetIcon)
    .setTitle(`**Report**`)
    .addField("Reported User", `${target.user} with ID: ${target.user.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Report Reason", reason)
    .addField("Report channel", message.channel.name)
    .addField("Report Time", message.createdAt)
    .setFooter(`Requested by: ${message.author.username}`, authorIcon)
    .setTimestamp();

  let pmEmbed = new Discord.RichEmbed()
    .setColor("#ff99e6")
    .setThumbnail(authorIcon)
    .setTitle(`**You Just Got Reported in the server "${message.guild.name}"**`)
    .addField("You got reported by", `${message.author}`)
    .addField("For the reason", reason)
    .addField("In the channel", message.channel.name)
    .addField("At", message.createdAt)
    .setFooter(`Requested by: ${message.author.username}`, authorIcon)
    .setTimestamp();

  target.user.send(pmEmbed);
  majorEventsChannel.send(majorEventsEmbed);
  message.channel.send(reportPublicEmbed);
}

module.exports.help = {
  name: "report"
}