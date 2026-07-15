const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { filterEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tremolo')
        .setDescription('Toggle tremolo effect'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ embeds: [errorEmbed('No song playing!', client)], ephemeral: true });
        }

        const isEnabled = queue.filters.ffipeset?.tremolo?.status || false;
        if (isEnabled) {
            queue.filters.ffipeset.tremolo.disable();
        } else {
            queue.filters.ffipeset.tremolo.enable({ frequency: 4, depth: 0.3 });
        }

        return interaction.reply({ embeds: [filterEmbed('Tremolo', !isEnabled, client)] });
    }
};