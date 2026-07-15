// =======================================
// 🎮 Nightcore Filter Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nightcore')
        .setDescription('Toggle nightcore effect'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const isEnabled = queue.filters.ffipeset?.nightcore?.status || false;
        if (isEnabled) {
            queue.filters.ffipeset.nightcore.disable();
        } else {
            queue.filters.ffipeset.nightcore.enable();
        }

        return interaction.reply({ embeds: [filterEmbed('Nightcore', !isEnabled, client)] });
    }
};