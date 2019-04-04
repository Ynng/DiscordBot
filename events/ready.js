const Discord = require("discord.js")
const config = require("../botconfig.json");


module.exports = bot => {
    console.log(`${bot.user.username} is online!`);
    let statuses = [
        `over ${bot.guilds.size} servers!`,
        `for "${config.prefix}help"`,
        `over ${bot.users.size} users!`
    ]
    let statusNum = 0;
    setInterval(() => {
        let status = statuses[statusNum];
        bot.user.setActivity(status, { type: "WATCHING" })
            .then(presence => console.log(`Activity set to "${status}"`))
            .catch(console.error);
        if(statusNum>=statuses.length-1)statusNum=0;
        else statusNum++;
    }, 5000);
}