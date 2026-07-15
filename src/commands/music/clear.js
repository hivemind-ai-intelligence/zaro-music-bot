// =======================================
// 📋 Clear Queue Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('📋 Clear the queue'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        const trackCount = queue.tracks.size;
        
        if (trackCount === 0) {
            return interaction.reply({
                embeds: [errorEmbed('Queue is already empty!', client)],
                ephemeral: true,
            });
        }

        queue.tracks.clear();
        
        return interaction.reply({
            embeds: [successEmbed(`📋 Cleared **${trackCount}** songs from the queue!`, client)],
        });
    },
};