// =======================================
// ✅ READY EVENT
// =======================================

const logger = require('../utils/logger');
const ZaroMusicBot = require('../bot');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.success(`Logged in as ${client.user.tag}!`);
        logger.info(`Bot ID: ${client.user.id}`);
        logger.info(`Servers: ${client.guilds.cache.size}`);
        logger.info(`Users: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);

        // Initialize Discord Player (requires client to be ready)
        if (!client.player) {
            // The bot instance is stored on client by index.js
            const bot = global.zaroBot;
            if (bot) {
                bot.initPlayer();
                bot.startStatusRotation();
            }
        }

        // Start status rotation if player is ready
        if (client.player && !global.statusRotationStarted) {
            global.statusRotationStarted = true;
            const bot = global.zaroBot;
            if (bot) bot.startStatusRotation();
        }

        logger.info('🏵 Zaro Music Bot is ready to rock! 📸');
    }
};