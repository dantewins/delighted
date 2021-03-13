const Discord = require('discord.js');

module.exports = {
    name: 'prefix',
    category: "utilities",
    description: 'Can find and display the prefix for the server mentioned or change the prefix of that server.',
    run: async (client, message, args, db) => {
        let nPrefix = args[0];
        let currentPrefix = "";

        if (!nPrefix) {
            db.collection('guilds').doc(message.guild.id).get().then((q) => {
                if (q.exists) {
                    currentPrefix = q.data().prefix;
                } else {
                    message.channel.send('Error no prefix found.');
                }
            }).then(async () => {
                message.channel.send(`My prefix is \`${currentPrefix}\`.`);
                return;
            });
        } else {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission to change my prefix.");
            db.collection('guilds').doc(message.guild.id).update({
                'prefix': nPrefix
            }).then(() => {
                message.channel.send(`Successfully updated my prefix to \`${nPrefix}\`.`);
            });
        }
    }
}