"use strict";

const { RichEmbed } = require("discord.js");

const { homeUrl } = require("../botconfig.json");
module.exports = {
    embedAddStamp: function (embed, author) {
        embed
            .setFooter(`Requested by: ${author.username}`, author.avatarURL)
            .setTimestamp();
    },

    getAgeDate: function (birthday) {
        return new Date(Date.now() - birthday.valueOf());
    },

    getAgeString: function (age) {
        return `${age.getFullYear() - 1970} Years, ${age.getMonth()} Months, ${age.getDate()} Days`
    },

    getPermissionsString: function (permission) {
        let output = permission
            .replace("ADD_REACTIONS", "Add Reactions")
            .replace("ADMINISTRATOR", "Administrator")
            .replace("ATTACH_FILES", "Attach Files")
            .replace("BAN_MEMBERS", "Ban Members")
            .replace("CHANGE_NICKNAME", "Change Nickname")
            .replace("CONNECT", "Connect")
            .replace("CREATE_INSTANT_INVITE", "Create Instant Invite")
            .replace("DEAFEN_MEMBERS", "Deafen Members")
            .replace("EMBED_LINKS", "Embed Links")
            .replace("KICK_MEMBERS", "Kick Members")
            .replace("MANAGE_CHANNELS", "Manage Channels")
            .replace("MANAGE_EMOJIS", "Manage Emojis")
            .replace("MANAGE_GUILD", "Manage Server")
            .replace("MANAGE_MESSAGES", "Manage Messages")
            .replace("MANAGE_NICKNAMES", "Manage Other Nicknames")
            .replace("MANAGE_ROLES", "Manage Roles")
            .replace("MANAGE_WEBHOOKS", "Manage Webhooks")
            .replace("MENTION_EVERYONE", "Mention Everyone")
            .replace("MOVE_MEMBERS", "Move Members")
            .replace("MUTE_MEMBERS", "Mute Members")
            .replace("READ_MESSAGE_HISTORY", "Read Message History")
            .replace("SEND_MESSAGES", "Send Messages")
            .replace("SEND_TTS_MESSAGES", "Send Text-to-Speech Messages")
            .replace("SPEAK", "Speak")
            .replace("VIEW_AUDIT_LOG", "View Audit Log")
            .replace("VIEW_CHANNEL", "View Channel")
            .replace("USE_EXTERNAL_EMOJIS", "Use External Emojis")
            .replace("USE_VAD", "Use Voice Activation Detection");
        return output;
    }
};