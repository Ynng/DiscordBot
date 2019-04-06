const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
  if (utils.isDM(message)) return;
  if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleError("I don't have the permission to remove messages", message, true);
  if (!message.member.hasPermission(this.help.permission)) return utils.simpleError("You don't have the permission to remove messages", message, true);

  messageCount = args[0];
  if(!messageCount) return utils.simpleError("You need the number of messages to remove", message, true);
  messageCount=Number(messageCount);
  if(!messageCount||messageCount<1) return utils.simpleError("Please enter a positive integer number", message, true);

  message.channel.bulkDelete(messageCount)
  utils.simplePermanent(`:ok_hand: Removed ${messageCount} messages from "${message.channel.name}"`, message, config.validColor);
}

module.exports.help = {
  name: "removeMessages",
  args: "{# of messages}",
  permission: "MANAGE_MESSAGES",
  description: "Removes the specified number of messages in the current channel",
  example: "10 bot",
  aliases: ["removeMessages","remove","clear","c"]
}