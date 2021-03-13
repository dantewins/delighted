const Discord = require('discord.js');

module.exports = {
    name: 'purge',
    category: "utilities",
    aliases: ['p'],
    description: 'Clears the amount of messages stated.',
    run: async (client, message, args, db) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to use this command.");
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I do not have \`MANAGE_MESSAGES\` permission.");
        if (!args[0]) return message.channel.send("You must state a number of messages to purge. \`-purge number\`");
        const amountToDelete = Number(args[0], 10);

        if (isNaN(amountToDelete)) return message.channel.send("Number stated is not a valid number.");
        if (!Number.isInteger(amountToDelete)) return message.channel.send("Number stated must be a whole number.");
        if (!amountToDelete || amountToDelete < 2 || amountToDelete > 100) return message.channel.send('The number stated must be between 2 and 100');
        const fetched = await message.channel.messages.fetch({
            limit: amountToDelete
        });

        try {
            await message.channel.bulkDelete(fetched)
                .then(messages => message.channel.send(`Deleted ${messages.size} messages!`).then(message => {
                    message.delete({
                        timeout: 4000
                    });
                }));
        } catch (err) {
            console.log(err);
            message.channel.send(`I was unable to delete the amount stated make sure the messages are within 14 days old.`);
        }
    }
}