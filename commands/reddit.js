const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")
const request = require("request-promise-native");



module.exports.run = async (bot, message, args) => {
    let searchQuery = args.join(" ");
    if (!searchQuery) return utils.simpleError("You need to enter something to search for", message, true);
    let requestQuery = {
        uri: 'https://www.reddit.com/search.json',
        qs: {
            q: searchQuery,
            sort: "relevance"
        },
        json: true
    }

    let requestResponse = (await request(requestQuery, (error, response, body) => {
        if ((response.statusCode % 100) != 2) {
            // console.log("everything correct");
        } else {
            console.log(`error: ${response.statusCode} when requesting from reddit`);
            utils.simpleTemporary(`:thinking: error ${response.statusCode} from reddit... interesting`, message, config.errorColor);
        }
    }).catch(error => {

    })).data

    if (!requestResponse) return utils.simpleTemporary(":thinking: Didn't get any response from reddit...", message, config.errorColor);
    let responseLength = requestResponse.dist
    if (responseLength < 1) return utils.simpleTemporary(":thinking: Didn't find anything at all, maybe try searching something else?", message, config.errorColor);

    requestResponse = requestResponse.children;


    for (var i = requestResponse.length - 1; i >= 0; i--) {
        //filtering out nsfw and videos
        if (requestResponse[i].data.over_18
            || requestResponse[i].data.is_video
            || requestResponse[i].data.media
            || !(requestResponse[i].data.url.endsWith(".png")
            || requestResponse[i].data.url.endsWith(".jpg")
            || requestResponse[i].data.url.endsWith(".gif")))
            requestResponse.splice(i, 1);
    }
    
    responseLength = requestResponse.length;

    if (responseLength < 1) return utils.simpleTemporary(":thinking: Didn't find any **sfw images**, maybe try searching something else?", message, config.errorColor);

    let childrenIndex = Math.floor(Math.random() * responseLength);
    // let childrenIndex = 0
    requestResponse = requestResponse[childrenIndex].data;
    console.log(requestResponse)

    let embed = new Discord.RichEmbed()
        .setTitle(`r/${requestResponse.subreddit}/${requestResponse.title}`)
        .setImage(requestResponse.url)
        .setColor(config.embedColor)
    if (message.channel.type != "dm") utils.embedAddStamp(message, embed, message.author);

    message.channel.send(embed);
}

module.exports.help = {
    name: "reddit",
    args: `{stuff to search} `,
    example: "chika",
    description: "Pulls a random image from the top 25 reddit search results",
    aliases: ["reddit", "r"],
}