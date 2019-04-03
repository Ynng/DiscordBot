'use strict';
//TODO: add tokens to git ignore before making the repo public

const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./botconfig.json");
const { token } = require("./tokens.json");



bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity(`for the prefix: ${config.prefix}`, { type: "WATCHING" })
    .then(presence => console.log(`Activity set to "${presence.game ? presence.game.name : "none"}"`))
    .catch(console.error);
});

bot.on("message", async message => {
  if (message.author.bot) return;
  // if(message.channel.type === "dm") return;

  var prefix = config.prefix;

  if (message.content.startsWith(prefix)) {
    var msg = message.content.substring(prefix.length).trim();
    var args = msg.split(" ");
    var cmd = args.shift();

    console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);

    if (cmd === "ping") {
      message.channel.send("pong!");
    }
    if (cmd === "info") {
      let botIcon = bot.user.displayAvatarURL;
      let botAge = new Date(Date.now() - bot.user.createdTimestamp);


      let botEmbed = new Discord.RichEmbed()
        .setTitle(`**${bot.user.username}'s Information**`)
        .setColor("#ff99e6")
        .setThumbnail(botIcon)
        .addField("My Name", bot.user.username)
        .addField("My Age", `${botAge.getFullYear() - 1970} Years, ${botAge.getMonth()} Months, ${botAge.getDate()} Days`)
        .addField("My Prefix", `\`${config.prefix}\``)


      return message.channel.send(botEmbed);
    }
    if (cmd === "server") {
      let serverIcon = message.guild.iconURL;
      let serverAge = new Date(Date.now() - message.guild.createdTimestamp);

      let serverEmbed = new Discord.RichEmbed()
        .setTitle(`**Server Information**`)
        .setColor("#ff99e6")
        .setThumbnail(serverIcon)
        .addField("Server Name", message.guild.name)
        .addField("Server age", `${serverAge.getFullYear() - 1970} Years, ${serverAge.getMonth()} Months, ${serverAge.getDate()} Days`)
        .addField("Total Members", message.guild.memberCount)
        .addField("Server Owner", message.guild.owner)

      return message.channel.send(serverEmbed);
    }
    if (cmd === "report") {
      let reportsChannel = message.guild.channels.find("name", `${config.reportsChannel}`);
      if (!reportsChannel) return message.channel.send(`Can't find the reports channel: "${config.reportsChannel}", please create one or change the reports channel in settings`);

      let reportedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if (!reportedUser) return message.channel.send("Couldn't find user.");

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


      let reportChannelEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(reportedUserIcon)
        .setTitle(`**@${reportedUser.user.username} Got Reported!**`)
        .addField("Reported User", `${reportedUser.user} with ID: ${reportedUser.user.id}`)
        .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
        .addField("Report Reason", reason)
        .addField("Report Time", message.createdAt);



      reportsChannel.send(reportChannelEmbed);
      return message.channel.send(reportPublicEmbed);
    }

    if (cmd === "kick") {
      let kickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if (!kickedUser) return message.channel.send("Couldn't find user.");

      args.shift();
      let reason = args.join(" ");
      if(!reason) reason = "No Reason Is Given";
      let kickedUserIcon = kickedUser.user.avatarURL;

      let kickEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(kickedUserIcon)
        .addField(`**@${kickedUser.user.username} Just Got Kicked!**`, `${kickedUser.user} Have Been Kicked By ${message.author}`)
        .addField("For the reason", reason)

      return message.channel.send(kickEmbed);
    }
  }
});

bot.login(token).catch(error => {
  console.log(error);
  console.log("Failed to Connect");
  return;
})
