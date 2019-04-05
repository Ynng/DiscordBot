"use strict";

const Discord = require("discord.js");

const config = require("../botconfig.json");

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
    },

    getHelpString: function (command) {
        let usage = command.help.args;
        let aliases = command.help.aliases;
        let permission = command.help.permission;
        let description = command.help.description;
        let example = command.help.example;
        let name = command.help.name;

        if (!name) name = aliases[0];
        if (!usage) {
            usage = `${config.prefix}${name}`;
            if (!example) example = usage;
        }
        else {
            usage = `${config.prefix}${name} ${usage}`;
            if (!example) example = "No example provided"
            else example = `${config.prefix}${name} ${example}`
        }
        if (!permission) permission = "None";
        permission = this.getPermissionsString(permission);
        if (!description) description = "No description provided";
        aliases = aliases.join(" , ");

        return `\`\`\`html\n< ${usage} >\`\`\`\`\`\`md\n# Aliases\n${aliases}\n# Permission Needed\n${permission}\n# Description\n${description}\n# Example Commmand(s)\n${example}\`\`\`\`\`\`md\n> Remove Brackets when typing commands\n> [] = optional arguments\n> {} = mandatory arguments\`\`\``
    },

    getCommandsNameArray: function (bot) {
        var output = [];

        bot.commands.array().forEach(command => {
            output.push(command.help.name);
        });
        return output;
    },

    getSimpleEmbed: function (text, user, color) {
        let embed = new Discord.RichEmbed()
            .setTitle(text)
            .setColor(color)
        this.embedAddStamp(embed, user);

        return embed;
    },

    errorTemporary: function (text, message) {
        let embed = new Discord.RichEmbed()
            .setTitle(`:no_entry_sign: ${text}`)
            .setFooter(`Removing in ${config.tempTime / 1000} seconds`)
            .setColor(config.errorColor)
        message.channel.send(embed).then(r => {
            this.safeDeleteMessage(r, config.tempTime);
            this.safeDeleteMessage(message, config.tempTime);
        });
    },

    errorPermanent: function (text, message) {
        let embed = new Discord.RichEmbed()
            .setTitle(`:no_entry_sign: ${text}`)
            .setColor(config.errorColor)
        this.embedAddStamp(embed, message.author);
        message.channel.send(embed)
    },

    errorPreferTemporary: function (text, message) {
        if (message.deletable)this.errorTemporary(text, message);
        else this.errorPermanent(text, message);
    },

    checkServer: function (message) {
        if (message.channel.type != "text") {
            this.errorPermanent("This command only works in a server", message);
            return true;
        } else return false;
    },

    safeDeleteMessage: function (message, timeout) {
        message.delete(timeout).catch(error => {
            console.log(error);
            console.log("Failed to delete message");
            return;
        });
    }
};