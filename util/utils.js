"use strict";

const Discord = require("discord.js");

const config = require("../botconfig.json");

module.exports = {
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

    simpleError: function (text, message, temp) {
        if (temp) return this.simpleTemporary(`:no_entry_sign: ${text}`, message, config.errorColor);
        else return this.simplePermanent(`:no_entry_sign: ${text}`, message, config.errorColor);
    },

    simpleTemporary: function (text, message, color) {
        if (!message.deletable) return this.simplePermanent(text, message, color);
        let embed = new Discord.RichEmbed()
            .setTitle(`${text}`)
            .setFooter(`Removing in ${config.tempTime / 1000} seconds`)
            .setColor(color)
        return message.channel.send(embed).then(msg => {
            this.safeDeleteMessage(msg, config.tempTime);
            this.safeDeleteMessage(message, config.tempTime);
        });
    },

    simplePermanent: function (text, message, color) {
        let embed = new Discord.RichEmbed()
            .setTitle(`${text}`)
            .setColor(color)
        this.embedAddStamp(message, embed, message.author);
        return message.channel.send(embed)
    },
    
    editTemporary: function (text, editMessage, originMessage, color) {
        if (!originMessage.deletable) return this.editPermanent(text, editMessage, originMessage, color);
        let embed = new Discord.RichEmbed()
            .setTitle(`${text}`)
            .setFooter(`Removing in ${config.tempTime / 1000} seconds`)
            .setColor(color)
        return editMessage.edit(embed).then(msg => {
            this.safeDeleteMessage(msg, config.tempTime);
            this.safeDeleteMessage(originMessage, config.tempTime);
        });
    },

    editPermanent: function (text, editMessage, originMessage, color) {
        let embed = new Discord.RichEmbed()
            .setTitle(`${text}`)
            .setFooter(`Removing in ${config.tempTime / 1000} seconds`)
            .setColor(color)
        this.embedAddStamp(originMessage, embed, originMessage.author);
        return editMessage.edit(embed)
    },

    isDM: function (message) {
        if (message.channel.type != "text") {
            this.simpleError("This command only works in a server", message, false);
            return true;
        } else return false;
    },

    safeDeleteMessage: function (message, timeout) {
        // eslint-disable-next-line no-unused-vars
        message.delete(timeout).catch(error => {
            // eslint-disable-next-line no-console
            console.log("Failed to delete message");
            return;
        });
    },

    embedAddStamp: function (message, embed, author) {
        if (message.channel.type != "dm") {
            embed
                .setFooter(`Requested by: ${author.username}`, author.avatarURL)
                .setTimestamp();
        }
    }
};