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
      return message.channel.send(reportPublicEmbed);
    }

    if (cmd === "kick") {
      let kickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      let kickedUserIcon = kickedUser.user.avatarURL;
      let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);
      if(kickedUser.hasPermission("KICK_MEMBERS")) return message.channel.send("You can't kick an admin")

      if(kickedUser.user===message.author){
        let kickEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(kickedUserIcon)
        .addField(`**@${kickedUser.user.username} Just Kicked Itself**`, `${kickedUser.user} Just Kicked itself`)
        .addField("Well, It asked for it", "idk......")

        let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(kickedUserIcon)
        .setTitle(`**@${kickedUser.user.username} Just Kicked Itself!**`)
        .addField("Kicked User", `${kickedUser.user} with ID: ${kickedUser.user.id}`)
        .addField("Kick Time", message.createdAt);

        message.guild.member(kickedUser).kick("You asked for it");
        majorEventsChannel.send(majorEventsEmbed);
        return message.channel.send(kickEmbed);
      }

      if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You don't have the permission to Kick People")
      
      if (!kickedUser) return message.channel.send("Couldn't find user.");
      if(kickedUser.hasPermission("KICK_MEMBERS")) return message.channel.send("You can't kick an admin")
      
      if (!majorEventsChannel) return message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

      args.shift();
      let reason = args.join(" ");
      if(!reason) reason = "No Reason Is Given";

      let kickEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(kickedUserIcon)
        .addField(`**@${kickedUser.user.username} Just Got Kicked!**`, `${kickedUser.user} Have Been Kicked By ${message.author}`)
        .addField("For the reason", reason)

      let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(kickedUserIcon)
        .setTitle(`**@${kickedUser.user.username} Just Got Kicked!**`)
        .addField("Kicked User", `${kickedUser.user} with ID: ${kickedUser.user.id}`)
        .addField("Kicked By", `${message.author} with ID: ${message.author.id}`)
        .addField("Kicked Reason", reason)
        .addField("Kick Time", message.createdAt);

      message.guild.member(kickedUser).kick(reason);
      majorEventsChannel.send(majorEventsEmbed);
      return message.channel.send(kickEmbed);
    }

    if (cmd === "ban") {
      let bannedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      let bannedUserIcon = bannedUser.user.avatarURL;
      let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);
      if(bannedUser.hasPermission("BAN_MEMBERS")) return message.channel.send("You can't ban an admin")

      if(bannedUser.user===message.author){
        let banEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(bannedUserIcon)
        .addField(`**@${bannedUser.user.username} Just banned Itself**`, `${bannedUser.user} Just banned itself`)
        .addField("Well, It asked for it", "idk......")

        let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(bannedUserIcon)
        .setTitle(`**@${bannedUser.user.username} Just banned Itself!**`)
        .addField("banned User", `${bannedUser.user} with ID: ${bannedUser.user.id}`)
        .addField("ban Time", message.createdAt);

        message.guild.member(bannedUser).ban("You asked for it");
        majorEventsChannel.send(majorEventsEmbed);
        return message.channel.send(banEmbed);
      }

      if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the permission to ban people")
      
      if (!bannedUser) return message.channel.send("Couldn't find user.");
      if(bannedUser.hasPermission("BAN_MEMBERS")) return message.channel.send("You can't ban an admin")
      
      if (!majorEventsChannel) return message.channel.send(`Can't find the Major-Events channel: "${config.majorEventsChannel}", please create one or change the Major-Events channel in settings`);

      args.shift();
      let reason = args.join(" ");
      if(!reason) reason = "No Reason Is Given";

      let banEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(bannedUserIcon)
        .addField(`**@${bannedUser.user.username} Just Got Baned!**`, `${bannedUser.user} Have Been Baned By ${message.author}`)
        .addField("For the reason", reason)

      let majorEventsEmbed = new Discord.RichEmbed()
        .setColor("#ff99e6")
        .setThumbnail(bannedUserIcon)
        .setTitle(`**@${bannedUser.user.username} Just Got Baned!**`)
        .addField("Baned User", `${bannedUser.user} with ID: ${bannedUser.user.id}`)
        .addField("Baned By", `${message.author} with ID: ${message.author.id}`)
        .addField("Baned Reason", reason)
        .addField("Ban Time", message.createdAt);

      message.guild.member(bannedUser).ban(reason);
      majorEventsChannel.send(majorEventsEmbed);
      return message.channel.send(banEmbed);
    }
  }
});

bot.login(token).catch(error => {
  console.log(error);
  console.log("Failed to Connect");
  return;
})
