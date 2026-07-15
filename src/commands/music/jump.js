// =======================================
// 🗒️ Jump Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('🗒️ Jump to a position in the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position in queue to jump to')
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
                embeds: [errorEmbed(`There are only ${tracks.length} songs in queue.`, client)],
                ephemeral: true,
            });
        }

        const jumpTrack = tracks[position - 1];
        try {
            await queue.node.jump(position - 1);
        } catch (err) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to jump!', client)],
                ephemeral: true,
            });
        }

        return interaction.reply({
            embeds: [successEmbed(`🗒️ Jumped to **${jumpTrack.title}** (#${position}) 🎆', client)],
        });
    },
};