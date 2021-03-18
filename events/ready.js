module.exports = client => {
    client.on('ready', () => {
        client.user.setActivity(`happiness.`);
        console.log(`${client.user.username} ✅`);
    });
}