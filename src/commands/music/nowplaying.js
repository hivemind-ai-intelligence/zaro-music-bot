// =======================================
// 🎮�8* Now Playing Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { nowPlayingEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('🎮 Show info about the currently playing song'),
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        // Delete previous now playing message
        if (queue.metadata?.nowPlayingMessage) {
            await queue.metadata.nowPlayingMessage.delete().catch(() => {});
        }

        const embed = nowPlayingEmbed(queue.currentTrack, queue, client);
        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
        queue.metadata.nowPlayingMessage = msg;
    },
};