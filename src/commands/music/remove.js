// =======================================
// 🔖️ Remove Song Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('🔖️ Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position in queue to remove')
                .setRequired(true)
                .setMinValue(1)
        ),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        const position = interaction.options.getInteger('position');
        const tracks = queue.tracks.toArray();
        
        if (position > tracks.length) {
            return interaction.reply({
                embeds: [errorEmbed(`Invalid position! There are only ${tracks.length} songs in queue.`, client)],
                ephemeral: true,
            });
        }

        const removedTrack = tracks[position - 1];
        queue.node.remove(position - 1);
        
        return interaction.reply({
            embeds: [successEmbed(`🔖️ Removed **${removedTrack.title}** from the queue!`, client)],
        });
    },
};