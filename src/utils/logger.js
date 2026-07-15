// ==============================================
// 📝 LOGGER - Beautiful Console Logging
// ==============================================

const colors = require('colors');
const config = require('../../config');

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SUCCESS: 4,
    MUSIC: 5,
};

const currentLevel = config.debug ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

function getTimestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function debug(...args) {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
        console.log(colors.gray(`[${getTimestamp()}] [DEBUG]`), ...args);
    }
}

function info(...args) {
    if (currentLevel <= LOG_LEVELS.INFO) {
        console.log(colors.cyan(`[${getTimestamp()}] [INFO]`), ...args);
    }
}

function warn(...args) {
    if (currentLevel <= LOG_LEVELS.WARN) {
        console.log(colors.yellow(`[${getTimestamp()}] [WARN]`), ...args);
    }
}

function error(...args) {
    if (currentLevel <= LOG_LEVELS.ERROR) {
        console.log(colors.red(`[${getTimestamp()}] [ERROR]`), ...args);
    }
}

function success(...args) {
    if (currentLevel <= LOG_LEVELS.SUCCESS) {
        console.log(colors.green(`[${getTimestamp()}] [SUCCESS]`), ...args);
    }
}

function music(...args) {
    if (currentLevel <= LOG_LEVELS.MUSIC) {
        console.log(colors.magenta(`[${getTimestamp()}] [MUSIC]`), ...args);
    }
}

function logBanner() {
    console.log('');
    console.log(colors.magenta('╔══════════════════════════════════════════════╗'));
    console.log(colors.magenta('║') + colors.cyan('     🎵  ZARO MUSIC BOT v2.0  🎵          ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.white('     Advanced Discord Music Experience     ') + colors.magenta('║'));
    console.log(colors.magenta('╠══════════════════════════════════════════════╣'));
    console.log(colors.magenta('║') + colors.green('  ✅ 40+ Slash Commands                     ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.green('  🎤 Real-Time Lyrics (HI/EN/BN)            ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.green('  🎨 Animated Emoji Embeds                  ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.green('  ⚡ Audio Filters & Effects                ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.green('  📋 Advanced Queue Management              ') + colors.magenta('║'));
    console.log(colors.magenta('║') + colors.green('  🔄 24/7 Mode Support                      ') + colors.magenta('║'));
    console.log(colors.magenta('╚══════════════════════════════════════════════╝'));
    console.log('');
}

module.exports = {
    debug,
    info,
    warn,
    error,
    success,
    music,
    logBanner,
};
