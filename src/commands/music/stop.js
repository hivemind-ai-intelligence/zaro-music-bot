// =======================================
// 🔏️ Stop Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { stopEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('🔏️ Stop playback and clear the queue'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue) {
            return interaction.reply({
                embeds: [errorEmbed('I am not playing anything!', client)],
                ephemeral: true,
            });
        }

        // Clear 24/7 status
        client._247?.delete(interaction.guildId);

        queue.delete();
        return interaction.reply({ embeds: [stopEmbed(client)] });
    },
};