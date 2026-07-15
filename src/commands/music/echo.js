const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Toggle echo effect'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const isEnabled = queue.filters.ffipeset?.echo?.status || false;
        if (isEnabled) {
            queue.filters.ffipeset.echo.disable();
        } else {
            queue.filters.ffipeset.echo.enable({ decay: 0.3, delay: 500, feedback: 0.3 });
        }

        return interaction.reply({ embeds: [filterEmbed('Echo', !isEnabled, client)] });
    }
};