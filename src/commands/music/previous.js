// =======================================
// ⶵ️ Previous Song Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('ⶵ️ Play the previous song'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        if (!queue.history || queue.history.previousTrack === null) {
            return interaction.reply({
                embeds: [errorEmbed('No previous track available!', client)],
                ephemeral: true,
            });
        }

        const prevTrack = queue.history.previousTrack;
        try {
            await queue.history.back();
        } catch (err) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to play previous song!', client)],
                ephemeral: true,
            });
        }

        return interaction.reply({
            embeds: [successEmbed(`ⶵ️ Now playing **${prevTrack.title}** 🎆', client)],
        });
    },
};