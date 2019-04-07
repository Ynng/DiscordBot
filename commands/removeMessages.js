const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
  if (utils.isDM(message)) return;
  if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleError("I don't have the permission to remove messages", message, true);
  if (!message.member.hasPermission(this.help.permission)) return utils.simpleError("You don't have the permission to remove messages", message, true);

  var messageCount = args[0];
  if(!messageCount) return utils.simpleError("Please enter the number of messages to remove", message, true);
  messageCount=Number(messageCount);
  if(!messageCount||messageCount<1||messageCount>99) return utils.simpleError("Please enter a integer number between 1 and 100", message, true);
  
  message.channel.bulkDelete(messageCount+1)
  utils.simpleTemporary(`:ok_hand: Removed ${messageCount} messages from "${message.channel.name}"`, message, config.validColor);
}

module.exports.help = {
  name: "clear",
  args: "{# of messages}",
  permission: "MANAGE_MESSAGES",
  description: "Removes the specified number (1~99) of messages in the current channel",
  example: "10",
  aliases: ["removeMessages","remove","deleteMessages","delete","clear","c","d"]
}