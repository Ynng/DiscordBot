"use strict";

const { RichEmbed } = require("discord.js");

const { homeUrl } = require("./botconfig.json");
module.exports = {
    embedAddStamp:function(embed, author){
        embed
        .setFooter(`Requested by: ${author.username}`, author.avatarURL)
        .setTimestamp();
    },

    getAgeDate:function(birthday){
        return new Date(Date.now() - birthday.valueOf());
    },

    getAgeString:function(age){
        return `${age.getFullYear() - 1970} Years, ${age.getMonth()} Months, ${age.getDate()} Days`
    }
};