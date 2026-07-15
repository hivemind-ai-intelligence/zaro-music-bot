// =======================================
// 🎮 Karaoke Filter Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('karaoke')
        .setDescription('Toggle karaoke effect'),
    
    cooldown: 3,

    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const isEnabled = queue.filters.ffipeset?.karaoke?.status || false;
        if (isEnabled) {
            queue.filters.ffipeset.karaoke.disable();
        } else {
            queue.filters.ffipeset.karaoke.enable({ level: 1, monoLevel: 1, filterBand: 1, filterWidth: 1 });
        }

        return interaction.reply({ embeds: [filterEmbed('Karaoke', !isEnabled, client)] });
    }
};