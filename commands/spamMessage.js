const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")


module.exports.run = async (bot, message, args) => {
  if (utils.isDM(message)) return;
  if (!message.guild.member(bot.user).hasPermission(this.help.permission)) return utils.simpleError("I don't have the permission to spam messages", message, true);
  if (!message.member.hasPermission(this.help.permission)) return utils.simpleError("You don't have the permission to spam messages", message, true);

  messageCount = args[0];
  if(!messageCount) return utils.simpleError("Please enter the number of messages to remove", message, true);
  messageCount=Number(messageCount);
  if(!messageCount||messageCount<1||messageCount>50) return utils.simpleError("Please enter a integer number between 1 and 50", message, true);

  let i;
  for(i=0;i<messageCount;i++){
    utils.simplePermanent(`:ok_hand: Spam ${i}`,message,config.embedColor)
  }
  utils.simplePermanent(`:ok_hand: Spammed ${messageCount} messages in "${message.channel.name}"`, message, config.validColor);
}

module.exports.help = {
  name: "spamMessages",
  args: "{# of messages}",
  permission: "MANAGE_MESSAGES",
  description: "Spams the specified number (1~1000) of messages in the current channel for SCIENTIFIC PURPOSES ONLY",
  example: "10",
  aliases: ["spamMessages","spam"]
}