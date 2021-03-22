const { Collection } = require('discord.js');

const afk = new Collection();
const guilds = new Collection();

module.exports = { afk, guilds };