const Discord = require('discord.js');
const { afk, guilds } = require("../../Collection");

module.exports = {
    name: 'afk',
    category: 'utilities',
    aliases: [''],
    description: "Sets the user's status as 'afk'.",
    run : async (client, message, args) => {
        const reason = args.slice(0).join(" ") || "afk";

        afk.set(message.author.id [Date.now(), reason]);
        guilds.set(message.guild.id, new Collection());

        message.channel.send(`${message.author}, I set your afk: ${reason}.`);
    },
};