const Mongodb = require('../../models/modSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'removewarn',
    category: "moderation",
    aliases: ['rw'],
    description: 'Deletes warn mentioned.',
    run : async (client, message, args, db) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to use this command.');

        const caseNo = args[0];

        if (!args[0]) return message.channel.send('You need to state a case to remove. \`-warn case#\`');

        const warn = await Mongodb.findOne({ case : caseNo });
        if (warn) {
            warn.remove();
            message.channel.send(`Successfully deleted case ${caseNo}.`);
        } else {
            message.channel.send("That case doesn't not exist.");
        }
    }
}