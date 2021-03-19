module.exports = client => {
    client.on('ready', () => {
        client.user.setActivity(`happiness | -help`);
        console.log(`${client.user.username} ✅`);
    });
}