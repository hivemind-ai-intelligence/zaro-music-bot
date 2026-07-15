// ==============================================
// 🎮 COMMAND HANDLER - Slash & Prefix Commands
// ==============================================

const { REST, Routes, Collection, ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const logger = require('../utils/logger');

/**
 * Load all command files and register them
 */
async function loadCommands(client) {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandDirs = fs.readdirSync(commandsPath);

    const slashCommandsData = [];
    client.commands = new Collection();
    client.slashCommands = new Collection();

    for (const dir of commandDirs) {
        const dirPath = path.join(commandsPath, dir);
        
        // Skip non-directory files
        if (!fs.statSync(dirPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(dirPath, file);
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);

            if (!command.data || !command.execute) {
                logger.warn(`Skipping ${file}: missing data or execute`);
                continue;
            }

            const cmdName = command.data.name;
            
            // Store full command object for slash commands
            client.slashCommands.set(cmdName, command);
            
            // Also store by name for easy access
            client.commands.set(cmdName, command);
            
            // Handle aliases for prefix commands
            if (command.aliases) {
                for (const alias of command.aliases) {
                    client.commands.set(alias, command);
                }
            }

            slashCommandsData.push(command.data.toJSON());
            
            if (config.debug) {
                logger.debug(`Loaded command: ${cmdName} [${dir}]`);
            }
        }
    }

    // Register slash commands globally
    await registerSlashCommands(client, slashCommandsData);
    
    return client.commands;
}

/**
 * Register slash commands with Discord API
 */
async function registerSlashCommands(client, commands) {
    try {
        const rest = new REST({ version: '10' }).setToken(config.token);

        logger.info(`Registering ${commands.length} slash commands globally...`);

        // GLOBAL registration (works across all servers)
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );

        logger.success(`Registered ${commands.length} slash commands globally!`);
        
    } catch (error) {
        logger.error('Failed to register slash commands:', error.message);
        
        // Log detailed error info
        if (error.rawError?.errors) {
            const cmdErrors = error.rawError.errors;
            for (const [cmdName, err] of Object.entries(cmdErrors)) {
                logger.error(`  Command "${cmdName}" error:`, JSON.stringify(err, null, 2));
            }
        }
    }
}

/**
 * Handle slash command interaction
 */
async function handleSlashCommand(interaction) {
    const command = interaction.client.slashCommands.get(interaction.commandName);
    
    if (!command) {
        logger.warn(`Unknown slash command: ${interaction.commandName}`);
        return interaction.reply({
            content: '❌ This command is no longer available.',
            ephemeral: true
        }).catch(() => {});
    }

    // Cooldown check
    const cooldown = checkCooldown(interaction.client, interaction.user.id, interaction.commandName, command.cooldown || 3);
    if (cooldown > 0) {
        return interaction.reply({
            content: `⏳ Please wait **${cooldown}s** before using this command again!`,
            ephemeral: true
        }).catch(() => {});
    }

    try {
        await command.execute(interaction, interaction.client);
    } catch (error) {
        logger.error(`Error executing /${interaction.commandName}:`, error.message);
        console.error(error);

        const errorMsg = {
            content: '❌ An error occurred while executing this command.',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg).catch(() => {});
        } else {
            await interaction.reply(errorMsg).catch(() => {});
        }
    }
}

/**
 * Handle prefix (message) command
 */
async function handlePrefixCommand(message, client) {
    if (message.author.bot || !message.guild) return;

    const prefix = client.prefix || config.prefix;
    
    // Check for prefix
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    // Check if command supports prefix usage
    if (command.prefixOnly === false) {
        return message.reply('⚠️ This command is available as a slash command only! Use `/` instead.').catch(() => {});
    }

    // Cooldown check
    const cooldown = checkCooldown(client, message.author.id, commandName, command.cooldown || 3);
    if (cooldown > 0) {
        return message.reply(`⏳ Please wait **${cooldown}s** before using this command again!`).catch(() => {});
    }

    try {
        // Create a fake interaction-like object for prefix commands
        const pseudoInteraction = {
            commandName,
            user: message.author,
            member: message.member,
            guild: message.guild,
            channel: message.channel,
            client,
            replied: false,
            deferred: false,
            options: {
                getString: (name) => args[0] || null,
                getInteger: (name) => parseInt(args[0]) || null,
                getNumber: (name) => parseFloat(args[0]) || null,
                getBoolean: (name) => args[0]?.toLowerCase() === 'true',
                getUser: (name) => message.mentions.users.first() || null,
                getChannel: (name) => message.mentions.channels.first() || null,
                getSubcommand: () => args[0] || null,
            },
            async reply(opts) {
                this.replied = true;
                return message.reply(opts);
            },
            async editReply(opts) {
                if (this._replyMsg) return this._replyMsg.edit(opts);
                return message.channel.send(opts);
            },
            async deferReply(opts) {
                this.deferred = true;
            },
            async followUp(opts) {
                return message.channel.send(opts);
            },
            memberPermissions: message.member.permissions,
            guildPreferences: client.guildPreferences?.get(message.guild.id) || {},
        };

        await command.execute(pseudoInteraction, client, args);
        
    } catch (error) {
        logger.error(`Error executing ${prefix}${commandName}:`, error.message);
        message.reply('❌ An error occurred!').catch(() => {});
    }
}

/**
 * Cooldown system
 */
function checkCooldown(client, userId, commandName, cooldownSeconds) {
    if (!client.cooldowns.has(commandName)) {
        client.cooldowns.set(commandName, new Collection());
    }

    const timestamps = client.cooldowns.get(commandName);
    const now = Date.now();
    const cooldownAmount = cooldownSeconds * 1000;

    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;
        if (now < expirationTime) {
            return Math.ceil((expirationTime - now) / 1000);
        }
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return 0;
}

module.exports = {
    loadCommands,
    registerSlashCommands,
    handleSlashCommand,
    handlePrefixCommand,
};
