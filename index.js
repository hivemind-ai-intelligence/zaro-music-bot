// ==============================================
// 🎵 ZARO MUSIC BOT v2.0 - Entry Point
// ==============================================

require('dotenv').config();

const ZaroMusicBot = require('./src/bot');
const logger = require('./src/utils/logger');

// Create global reference for event handlers
const bot = new ZaroMusicBot();
global.zaroBot = bot;

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error.message);
    if (error.stack) logger.debug(error.stack);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error.message);
    if (error.stack) logger.debug(error.stack);
});

// Graceful shutdown
process.on('SIGINT', () => bot.shutdown());
process.on('SIGTERM', () => bot.shutdown());

// Start the bot
bot.init().catch(err => {
    logger.error('Failed to start bot:', err.message);
    console.error(err);
    process.exit(1);
});

logger.info('Zaro Music Bot starting...');
