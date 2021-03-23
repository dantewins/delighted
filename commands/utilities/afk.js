const Discord = require('discord.js');
const { afk } = require("../../Collection");

module.exports = {
    name: 'afk',
    category: 'utilities',
    aliases: [''],
    description: "Sets the user's status as 'afk'.",
    run : async (client, message, args) => {
        // const reason = args.slice(0).join(" ") || "afk";

        // if (!afk.has(message.guild.id)) {
        //     afk.set(message.guild.id, new Discord.Collection());
        // }

        // const extra = afk.get(message.guild.id);
        // extra.set(message.author.id, { timestamp: Date.now(), reason: reason });

        // message.channel.send(`${message.author}, I set your afk: ${reason}.`);

        message.channel.send("In development.");
    },
};