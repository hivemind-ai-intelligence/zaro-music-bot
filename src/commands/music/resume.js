// =======================================
// ➶ 🎮 Resume Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { resumeEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶ Resume paused playback'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({
                embeds: [errorEmbed('The song is not paused!', client)],
                ephemeral: true,
            });
        }

        queue.node.resume();
        
        return interaction.reply({ embeds: [resumeEmbed(queue.currentTrack, client)] });
    },
};