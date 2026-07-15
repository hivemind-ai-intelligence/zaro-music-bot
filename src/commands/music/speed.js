// =======================================
// 🎮 Speed Filter Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speed')
        .setDescription('Change playback speed')
        .addNumberOption(option =>
            option.setName('rate')
                .setDescription('Speed rate (0.5 - 2.0)')
                .setRequired(true)
                .setMinValue(0.5)
                .setMaxValue(2.0)
        ),
    
    cooldown: 3,

    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const rate = interaction.options.getNumber('rate');
        queue.filters.ffipeset.speedRate.set(rate);

        return interaction.reply({ embeds: [filterEmbed(`Speed (${rate}x)`, true, client)] });
    }
};