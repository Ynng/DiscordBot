const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
  if (utils.isDM(message)) return;
  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!target) return utils.simpleError("Can't find the user", message, true)

  let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);
  if (!majorEventsChannel) return utils.simpleError(`Can't find the Major-Events channel: "${config.majorEventsChannel}", no where to report to`, message, true);

  args.shift();
  let reason = args.join(" ");
  if (!reason) return utils.simpleError("You need a reason to ban someone", message, true);

  let targetIcon = target.user.avatarURL;
  let authorIcon = message.author.avatarURL;

  let embed = new Discord.RichEmbed()
    .setColor(`${config.validColor}`)
    .setThumbnail(targetIcon)
    .setTitle(`**@${target.user.username} Just Got Reported!**`)
    .addField("I have reported", target.user)
    .addField("On the behalf of", message.author)
    .addField("For the reason", reason)
  // utils.embedAddStamp(message, embed, message.author);



  let majorEventsEmbed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(targetIcon)
    .setTitle(`**Report**`)
    .addField("Reported User", `${target.user} with ID: ${target.user.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Report Reason", reason)
    .addField("Report channel", message.channel.name)
    .addField("Report Time", message.createdAt)
  // utils.embedAddStamp(message, majorEventsEmbed, message.author);


  let pmEmbed = new Discord.RichEmbed()
    .setColor(`${config.embedColor}`)
    .setThumbnail(authorIcon)
    .setTitle(`**You Just Got Reported in the server "${message.guild.name}"**`)
    .addField("You got reported by", `${message.author}`)
    .addField("For the reason", reason)
    .addField("In the channel", message.channel.name)
    .addField("At", message.createdAt)
  // utils.embedAddStamp(message, pmEmbed, message.author);

  target.user.send(pmEmbed).catch(error => {
    console.log("Error, can't send dm to a user");
});
  if (majorEventsChannel) majorEventsChannel.send(majorEventsEmbed);
  message.channel.send(embed);
}

module.exports.help = {
  name: "report",
  args: "{@user} {Reason}",
  description: "Reports the targetted user to the server admins",
  example: "@xX_KoolGamer6903_Xx for spamming",
  aliases: ["report"]
}