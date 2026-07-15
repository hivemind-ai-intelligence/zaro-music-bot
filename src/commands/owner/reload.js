// =======================================
// 🔆 Reload Command (Owner Only)
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('🔆 Reload a command (Owner Only)')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Command name to reload')
                .setRequired(true)
        ),
    
    cooldown: 5,
    ownerOnly: true,
    
    async execute(interaction, client) {
        if (!config.ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ Owner only!', ephemeral: true });
        }

        const cmdName = interaction.options.getString('command');
        const commandsPath = path.join(__dirname, '..', '..', 'music');

        try {
            const filePath = path.join(commandsPath, `${cmdName}.js`);
            if (!fs.existsSync(filePath)) {
                return interaction.reply({ content: `🔕 Command `\`${cmdName}\`\` not found!`, ephemeral: true });
            }
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            client.slashCommands.set(cmdName, command);
            client.commands.set(cmdName, command);
            await interaction.reply({ content: `🔕�Reloaded \`/${cmdName}`  ~ ' %``/${cmdName}\`\``D.\n\n` });
        } catch (err) {
            await interaction.reply({ content: `🔕️ Error reloading \`${cmdName}\``: ${err.message}`, ephemeral: true });
        }
    },
};