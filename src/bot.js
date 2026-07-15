// ==============================================
// 🤖 ZARO MUSIC BOT - Main Bot Class
// ==============================================

const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { Player } = require('discord-player');
const config = require('../config');
const logger = require('../utils/logger');
const { loadCommands } = require('../handlers/commandHandler');
const { loadEvents } = require('../handlers/eventHandler');
const { setupPlayer } = require('../handlers/playerHandler');

class ZaroMusicBot {
    constructor() {
        // Initialize Discord Client
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.Reaction,
                Partials.User,
                Partials.GuildMember,
            ],
            allowedMentions: {
                parse: ['users', 'roles'],
                repliedUser: true,
            },
            rest: {
                timeout: 15000,
                retries: 3,
            },
        });

        // Collections
        this.client.commands = new Collection();
        this.client.slashCommands = new Collection();
        this.client.cooldowns = new Collection();
        this.client.prefix = config.prefix;
        
        // 24/7 mode settings per guild
        this.client._247 = new Map();
        
        // Saved queues
        this.client.savedQueues = new Map();

        // Initialize Player AFTER client is ready
        this.player = null;
    }

    async init() {
        try {
            logger.logBanner();
            logger.info('Initializing Zaro Music Bot...');

            // Load commands
            await loadCommands(this.client);
            logger.success(`Loaded ${this.client.slashCommands.size} slash commands`);

            // Load events
            await loadEvents(this.client);
            logger.success('Events loaded successfully');

            // Login
            if (!config.token) {
                logger.error('TOKEN not found in .env file!');
                logger.error('Please create a .env file with your bot TOKEN.');
                process.exit(1);
            }

            await this.client.login(config.token);
            logger.success('Bot logged in successfully!');

        } catch (err) {
            logger.error('Failed to initialize bot:', err.message);
            console.error(err);
            process.exit(1);
        }
    }

    initPlayer() {
        this.player = new Player(this.client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                filter: 'audioonly',
            },
            smoothVolume: true,
            autoSelfDeaf: true,
            leaveOnEmpty: config.autoLeaveTimeout > 0,
            leaveOnEmptyCooldown: config.autoLeaveTimeout * 1000,
            leaveOnEnd: config.autoLeaveTimeout > 0,
            leaveOnEndCooldown: config.autoLeaveTimeout * 1000,
            useLegacyFFmpeg: false,
        });

        // Store reference on client
        this.client.player = this.player;

        // Setup extractors and events
        setupPlayer(this.client, this.player);
        
        logger.success('Discord Player initialized!');
    }

    /**
     * Rotate bot status with dynamic placeholders
     */
    startStatusRotation() {
        let index = 0;
        const statuses = config.statusRotation;

        const updateStatus = () => {
            const status = statuses[index % statuses.length];
            let text = status.text
                .replace('{guilds}', this.client.guilds.cache.size.toString())
                .replace('{members}', this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString());

            const typeMap = {
                PLAYING: ActivityType.Playing,
                WATCHING: ActivityType.Watching,
                LISTENING: ActivityType.Listening,
                STREAMING: ActivityType.Streaming,
                COMPETING: ActivityType.Competing,
            };

            try {
                this.client.user.setActivity({
                    name: text,
                    type: typeMap[status.type] || ActivityType.Listening,
                });
            } catch (err) {
                // Ignore status errors
            }

            index++;
        };

        // Set initial status
        updateStatus();
        
        // Rotate every N seconds
        this.statusInterval = setInterval(updateStatus, config.statusInterval * 1000);
        logger.info(`Status rotation started (${config.statusInterval}s interval)`);
    }

    /**
     * Graceful shutdown
     */
    async shutdown() {
        logger.warn('Shutting down...');
        if (this.statusInterval) clearInterval(this.statusInterval);
        if (this.player) {
            // Destroy all players
            this.player.players.forEach(p => p.destroy());
        }
        await this.client.destroy();
        process.exit(0);
    }
}

module.exports = ZaroMusicBot;
