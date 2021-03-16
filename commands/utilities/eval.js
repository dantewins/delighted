const Discord = require('discord.js');

module.exports = {
    name: 'eval',
    category: "utilities",
    description: 'Evaluates code that has been inputted.',
    hidden: true,
    run: async (client, message, args) => {
        if (message.author.id !== '467388782744829953') return;

        const code = args.join(" ");
        if (!code) return message.reply('please provide me code to evaluate.');

        try {
            const result = await eval(code);
            let output = result;

            if (typeof result !== 'string') {
                output = inspect(result);
            }

            message.channel.send(output, {
                code: 'js'
            });
        } catch (error) {
            message.channel.send('The output of the inputted code cannot be displayed.');
        }
    }
}