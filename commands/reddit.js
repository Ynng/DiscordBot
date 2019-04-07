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

    if (!args[0]) return utils.simpleError("You need to enter a valid subreddit or something to search for", message, true);
    if (args[0].startsWith("r/")) {
        if (args.length > 1) {
            var subreddit = args.shift();
            var requestQuery = {
                uri: `https://www.reddit.com/${subreddit}/search.json`,
                qs: {
                    q: args.join(" "),
                    sort: "relevance",
                    limit: 50,
                    restrict_sr: 1
                },
                json: true
            }
        } else {
            var requestQuery = {
                uri: `https://www.reddit.com/${args[0]}.json`,
                qs: {
                    limit: 50,
                },
                json: true
            }
        }
    } else {
        var requestQuery = {
            uri: `https://www.reddit.com/search.json`,
            qs: {
                q: args.join(" "),
                sort: "relevance",
                limit: 50,
                restrict_sr: 0
            },
            json: true
        }
    }

    console.log(requestQuery)

    loadingMessage = await message.channel.send(loadingEmbed)
    let requestResponse = (await request(requestQuery, (error, response, body) => {
        if ((response.statusCode % 100) != 2) {
            // console.log("everything correct");
        } else {
            console.log(`error: ${response.statusCode} when requesting from reddit`);
            utils.editTemporary(`:thinking: error ${response.statusCode} from reddit...`, loadingMessage, message, config.errorColor);
            // return;
        }
    }).catch(error => { }))

    if (!requestResponse) {
        if (subreddit) return utils.editTemporary(`:thinking: didn't get any response from reddit, probabily due to mispelled subreddit name`, loadingMessage, message, config.errorColor);
        return utils.editTemporary(`:thinking: didn't get any response from reddit, maybe reddit is down?`, loadingMessage, message, config.errorColor);
    }
    if (requestResponse.error) return utils.editTemporary(`:thinking: error ${requestResponse.error} from reddit...`, loadingMessage, message, config.errorColor);
    console.log(requestResponse)
    if (!requestResponse.data)return utils.editTemporary(`:thinking: didn't get any search results, try searching for something else?`, loadingMessage, message, config.errorColor);
    if (!requestResponse.data.dist||!requestResponse.data.children) return utils.editTemporary(":thinking: didn't get any search results, try searching for something else?", loadingMessage, message, config.errorColor);
    let responseLength = requestResponse.data.dist
    requestResponse = requestResponse.data.children;
    if (responseLength < 1) return utils.editTemporary(":thinking: didn't get any search results, try searching for something else?", loadingMessage, message, config.errorColor);


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
    args: `[r/subreddit name] [stuff to search for]`,
    example: "r/animemes chika",
    description: "Pulls a random image from the top 50 results",
    aliases: ["reddit", "r"],
}