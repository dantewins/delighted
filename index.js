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
    useUnifiedTopology : true,
    useNewUrlParser: true,
}).then(console.log('Successfully connected to MongoDB!'));

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp ({
    credential : admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

let prefix;
const config = require('./config.json');
const token = config.token;
const { database } = require('./models/modSchema');

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
    if (!message.guild) return;
    db.collection('guilds').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            prefix = q.data().prefix;
        }
    }).then(async () => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        if (!message.member) message.member = await message.guild.fetchMember(message);

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length == 0) return;

        let command = client.commands.get(cmd);

        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) command.run(client, message, args, db);
    });
});

client.on('guildCreate', async gData => {
    db.collection('guilds').doc(gData.id).set({
        'guildID' : gData.id,
        'guildName' : gData.name,
        'guildOwner' : gData.owner.user.username,
        'guildOwnerID' : gData.owner.id,
        'guildMemberCount' : gData.memberCount,
        'prefix' : '-'
    });
});

client.login(token);