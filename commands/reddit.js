const Discord = require("discord.js");
const config = require("../botconfig.json");
const utils = require("../util/utils")
const request = require("request-promise-native");



module.exports.run = async (bot, message, args) => {
    let loadingEmbed = new Discord.RichEmbed()
        .setTitle(":thinking:  fetching...")
        .setColor(config.embedColor)
    utils.embedAddStamp(message, loadingEmbed, message.author);

    let loadingMessage;

    let searchQuery = args.join(" ");
    if (!searchQuery) return utils.simpleError("You need to enter something to search for", message, true);
    let requestQuery = {
        uri: 'https://www.reddit.com/search.json',
        qs: {
            q: searchQuery,
            sort: "relevance",
            limit: 50
        },
        json: true
    }

    loadingMessage = await message.channel.send(loadingEmbed)
    let requestResponse = (await request(requestQuery, (error, response, body) => {
        if ((response.statusCode % 100) != 2) {
            // console.log("everything correct");
        } else {
            console.log(`error: ${response.statusCode} when requesting from reddit`);
            utils.editTemporary(`:thinking: error ${response.statusCode} from reddit...`, loadingMessage, config.errorColor);
            // return;
        }
    }).catch(error => { }))

    if (!requestResponse.data) return utils.editTemporary(":frowning: Didn't get any response from reddit...", loadingMessage, message, config.errorColor);
    let responseLength = requestResponse.data.dist
    if (responseLength.data < 1) return utils.editTemporary(":frowning: Didn't find anything at all, maybe try searching something else?", loadingMessage, message, config.errorColor);

    requestResponse = requestResponse.data.children;


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

    if (responseLength < 1) return utils.editTemporary(":frowning: Didn't find any **sfw images**, maybe try searching something else?", loadingMessage, message, config.errorColor);

    let childrenIndex = Math.floor(Math.random() * responseLength);
    // let childrenIndex = 0
    requestResponse = requestResponse[childrenIndex].data;
    // console.log(requestResponse)

    let redditEmbed = new Discord.RichEmbed()
        .setAuthor(`r/${requestResponse.subreddit}`)
        .setURL(`https://www.reddit.com${requestResponse.permalink}`)
        .setTitle(`${requestResponse.title}`)
        .setImage(requestResponse.url)
        .setColor(config.validColor)
    utils.embedAddStamp(message, redditEmbed, message.author);
    loadingMessage.edit(redditEmbed)
}

module.exports.help = {
    name: "reddit",
    args: `{stuff to search} `,
    example: "chika",
    description: "Pulls a random image from the top 50 reddit search results",
    aliases: ["reddit", "r"],
}