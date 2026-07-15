// =======================================
// 💫 MESSAGE CREATE - Prefix Commands
// =======================================

const { handlePrefixCommand } = require('../handlers/commandHandler');
const config = require('../../config');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bots and DMs
        if (message.author.bot || !message.guild) return;

        // Handle prefix commands
        const prefix = client.prefix || config.prefix;
        if (message.content.startsWith(prefix)) {
            await handlePrefixCommand(message, client);
        }

        // Mention the bot to get prefix
        if (message.content.match(new RegExp(`^<*!?${client.user.id}>`))) {
            return message.reply({
                embeds: [{
                    color: 0x8A2BE2,
                    description: `🏵 ｊZaro Music Bot�\nMy prefix is \`${prefix}\`\nUse \`/help\` for all commands!`,
                }]
            }).catch(() => {});
        }
    }
};