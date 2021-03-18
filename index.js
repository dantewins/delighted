const {
    Collection,
    Client,
    Discord,
} = require('discord.js');
const fs = require('fs');
const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'USER', 'REACTION', 'GUILD_MEMBER']
});
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Delighted:zCoXEr8Qdqihgcle@delighted.7zbf2.mongodb.net/Data', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log('Successfully connected to MongoDB!'));

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

fs.readdirSync('./events').filter(file => file.endsWith(".js")).forEach(event => {
    require(`./events/${event}`)(client);
});

client.login(token);