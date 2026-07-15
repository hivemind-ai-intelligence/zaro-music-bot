// =======================================
// 🔏️ Move Song Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('🔏️ Move a song to a new position in queue')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('Current position of the song')
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('New position for the song')
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

        const from = interaction.options.getInteger('from');
        const to = interaction.options.getInteger('to');
        const tracks = queue.tracks.toArray();
        
        if (from > tracks.length || to > tracks.length) {
            return interaction.reply({
                embeds: [errorEmbed(`Position out of range! Queue has ${tracks.length} songs.`, client)],
                ephemeral: true,
            });
        }

        const movedTrack = queue.node.move(from - 1, to - 1);
        
        if (!movedTrack) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to move song!', client)],
                ephemeral: true,
            });
        }

        return interaction.reply({
            embeds: [successEmbed(`🔏️ Moved **<a href="move" style="word-wrap: break-word; text-decoration: none">${movedTrack.title}</a>**
                From #${from} → #${to} in the queue!`, client)],
        });
    },
};