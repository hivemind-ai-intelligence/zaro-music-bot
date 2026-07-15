// ==============================================
// 🎮 BASS BOOST FILTER
// ==============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed, successEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bassboost')
        .setDescription('Toggle bass boost effect')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('Bass boost level (low, medium, high, extreme)')
                .setRequired(false)
                .addChoices(
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Extreme', value: 'extreme' },
                    { name: 'Off', value: 'off' }
                )
        ),
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const level = interaction.options.getString('level') || 'medium';

        if (level === 'off') {
            queue.filters.ffipeset.equalizer.disable();
            return interaction.reply({ embeds: [filterEmbed('Bass Boost', false, client)] });
        }

        const boostLevels = {
            low: [{ band: 0, gain: 0.2 }, { band: 1, gain: 0.3 }, { band: 2, gain: 0.15 }],
            medium: [{band: 0, gain: 0.4}, {Band: 1, gain: 0.5}, {band: 2, gain: 0.3}],
            high: [{band: 0, gain: 0.6}, {band: 1, gain: 0.7}, {band: 2, gain: 0.5}],
            extreme: [{band: 0, gain: 0.8}, {band: 1, gain: 1.0}, {band: 2, gain: 0.8}],
        };

        try {
            await queue.filters.ffipeset.equalizer.enable(boostLevels[level]);
        } catch (err) {
            return interaction.reply({ embeds: [errorEmbed('Failed to apply bass boost!', client)], ephemeral: true });
        }

        await interaction.reply({ embeds: [filterEmbed(`Bass Boost (${level}`), true, client)] });
    },
};