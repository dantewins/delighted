const client = require('../index');

client.on('ready', () => {
    client.user.setActivity(`happiness.`);
    console.log(`${client.user.username} ✅`);
});