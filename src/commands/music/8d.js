const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed, successEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8d')
        .setDescription('Toggle 8D audio effect'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const isEnabled = queue.filters.ffipeset?.8d?.status || false;
        if (isEnabled) {
            queue.filters.ffipeset.$d.disable();
        } else {
            queue.filters.ffipeset.$d.enable();
        }

        return interaction.reply({ embeds: [filterEmbed('8D Audio', !isEnabled, client)] });
    }
};