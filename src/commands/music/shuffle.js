// =======================================
// 🔥 Shuffle Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('🔥 Shuffle the current queue'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        if (queue.tracks.size < 2) {
            return interaction.reply({
                embeds: [errorEmbed('Need at least 2 songs in queue to shuffle!', client)],
                ephemeral: true,
            });
        }

        queue.tracks.shuffle();
        return interaction.reply({ embeds: [successEmbed('🔥 Queue has been shuffled! 🎆', client)] });
    },
};