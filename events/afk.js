const { afk } = require('../Collection');
const moment = require('moment');

module.exports = client => {
    client.on('message', async (message) => {
        if (!message.guild || message.author.bot) return;

        const mentionedMember = message.mentions.members.first();

        if (mentionedMember) {
            const data = afk.get(mentionedMember.id, message.guild.id);

            if (data) {
                const [timestamp, reason] = data;
                const timeAgo = moment(timestamp).fromNow();

                message.channel.send(`${mentionedMember.user.username} is currently afk: ${reason} - ${timeAgo}.`);
            }
        }

        const getData = afk.get(message.author.id, message.guild.id);
        if (getData) {
            afk.delete(message.author.id, message.guild.id);
            message.channel.send(`Welcome back ${message.member}, I removed your afk.`).then(message =>{
                message.delete({
                    timeout: 4000
                });
            });
        }
    });
}