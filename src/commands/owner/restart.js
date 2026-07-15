// =======================================
// 🔆 Restart Command (Owner Only)
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('🔆 Restart the bot (Owner Only)'),
    
    cooldown: 10,
    ownerOnly: true,
    
    async execute(interaction, client) {
        if (!config.ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ Owner only!', ephemeral: true });
        }

        await interaction.reply({ content: '🔆 Restarting...', ephemeral: true });
        
        // Destroy all players
        if (client.player) {
            client.player.players.forEach(p => p.destroy());
        }
        
        process.exit(0);
    },
};