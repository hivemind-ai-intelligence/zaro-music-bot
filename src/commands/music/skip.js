// =======================================
// 🕈️ Skip Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { skipEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('🕈️ Skip the current song'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        const oldTrack = queue.currentTrack;
        
        try {
            await queue.node.skip();
        } catch (err) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to skip!', client)],
                ephemeral: true,
            });
        }
        
        const newTrack = queue.currentTrack;
        
        return interaction.reply({ embeds: [skipEmbed(oldTrack, newTrack, client)] });
    },
};