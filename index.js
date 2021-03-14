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

const guildsSchema = require('./models/guildsSchema');

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('ready', () => {
    client.user.setActivity(`happiness.`);
    console.log(`${client.user.username} ✅`);
});

client.on('message', async message => {
    const guildDB = await guildsSchema.findOne({
        guildId: message.guild.id
    });

    if (!guildDB) {
        const newGuild = new guildsSchema({
            guildId: message.guild.id,
            prefix: '-'
        });

        newGuild.save((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("guild was added to the db")
                client.prefix = '-'
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

client.login(token);