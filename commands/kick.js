const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
    if (utils.isDM(message)) return;
    
    if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleError("I need the **Kick Members** permission to do that", message, true);
    if (!message.member.hasPermission(this.help.permission)) return utils.simpleError("You need the **Kick Members** permission to do that", message, true);

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!target) return utils.simpleError("Can't find the user", message, true)
    if (target.hasPermission(this.help.permission)) return utils.simpleError("You can't kick someone with the permission **Kick Members**", message, true);
    if (!target.bannable) return utils.simpleTemporary(":thinking: I can't kick this user for some reason", message, config.errorColor);

    let targetIcon = target.user.avatarURL;
    let authorIcon = message.author.avatarURL;
    let majorEventsChannel = message.guild.channels.find("name", `${config.majorEventsChannel}`);

    args.shift();
    let reason = args.join(" ");
    if (!reason) reason = "No Reason was Given";

    if (!majorEventsChannel) utils.simpleError(`Can't find the Major-Events channel: "${config.majorEventsChannel}", detailed information about this kick won't be recorded`, message, false);

    let embed = new Discord.RichEmbed()
        .setColor(`${config.validColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**@${target.user.username} Just Got Kicked!**`)
        .addField(`I have kicked`, `${target.user}`)
        .addField(`On the behalf of`, `${message.author}`)
        .addField("For the reason", reason)
    // utils.embedAddStamp(message, embed, message.author);


    let majorEventsEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(targetIcon)
        .setTitle(`**Kick**`)
        .addField("Kicked User", `${target.user} with ID: ${target.user.id}`)
        .addField("Kicked By", `${message.author} with ID: ${message.author.id}`)
        .addField("Kick Reason", reason)
        .addField("Kick Time", message.createdAt)
    // utils.embedAddStamp(message, majorEventsEmbed, message.author);



    let pmEmbed = new Discord.RichEmbed()
        .setColor(`${config.embedColor}`)
        .setThumbnail(authorIcon)
        .setTitle(`**You Just Got Kicked from the server "${message.guild.name}"**`)
        .addField("You got kicked by", `${message.author}`)
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
        message.guild.member(target).kick();
    }, 2500);
}

module.exports.help = {
    name:"kick",
    args:"{@user} [Reason]",
    description:"Kicks the targetted user from this server.",
    permission:"KICK_MEMBERS",
    example:"@xX_KoolGamer6903_Xx for being retarded",
    aliases: ["kick"]
}