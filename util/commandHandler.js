const config = require("../botconfig.json");

module.exports = (bot, message) => {

    var prefix = config.prefix;

    if (message.content.startsWith(prefix) || message.channel.type == "dm") {
        if (message.content.startsWith(prefix)) {
            var msg = message.content.substring(prefix.length).trim();
        } else {
            var msg = message.content;
        }
        msg = msg.replace(/\s+/g, ' ');
        var args = msg.split(" ");
        var cmd = args.shift();


        var commmandfile = bot.commands.get(bot.aliases.get(cmd));
        if (commmandfile) {
            console.log(`@${message.author.username} just requested "${cmd}" with args "${args}"`);
            commmandfile.run(bot, message, args);
        }
    }
}  