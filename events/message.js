const Mongodb = require('../models/guildsSchema');

module.exports = client => {
    client.on("message", async (message) => {
        if (message.channel.type === 'dm') return client.emit('dm', message);

        const guildDB = await Mongodb.findOne({
            guildId: message.guild.id
        });

        if (!guildDB) {
            const newGuild = new Mongodb({
                guildId: message.guild.id,
                prefix: '-'
            });

            newGuild.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`${message.guild.name} was added to the guild DB.`);
                    client.prefix = '-';
                }
            })
        } else {
            client.prefix = guildDB.prefix;
        }

        if (!message.guild) return;
        if (message.author.bot) return;
        if (!message.content.startsWith(client.prefix)) return;
        if (!message.member) message.member = await message.guild.fetchMember(message);

        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length == 0) return;

        let command = client.commands.get(cmd);

        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) command.run(client, message, args);
    });

    client.on('dm', async (message) => {
        // Only dm messages are here
    });
}