const Discord = require('discord.js');
const { afk } = require("../../Collection");

module.exports = {
    name: 'afk',
    category: 'utilities',
    aliases: [''],
    description: "Sets the user's status as 'afk'.",
    run : async (client, message, args) => {
        const reason = args.slice(0).join(" ") || "afk";

        afk.set(message.author.id, message.guild.id, [Date.now(), reason]);

        message.channel.send(`${message.author}, I set your afk: ${reason}.`);
    },
};