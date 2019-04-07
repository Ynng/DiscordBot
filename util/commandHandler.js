const config = require("../botconfig.json");

module.exports = (bot, message) => {

    var prefix = config.prefix;
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${bot.user.id}>`) || message.channel.type == "dm") {
        // console.log("triggered")
        if (message.content.startsWith(prefix)) {
            var msg = message.content.substring(prefix.length).trim();
        } else if(message.content.startsWith(`<@${bot.user.id}>`)){
            var msg = message.content.substring(bot.user.id.length+3).trim();            
        }else {
            var msg = message.content;
        }
        msg = msg.replace(/\s+/g, ' ');
        var args = msg.split(" ");
        var cmd = args.shift();

        // console.log("cmd"+cmd)
        // console.log("args"+args);


        var commmandfile = bot.commands.get(bot.aliases.get(cmd));
        if (commmandfile) {
            console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);
            commmandfile.run(bot, message, args);
        }
    }
}  