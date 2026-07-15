// =======================================
// ò/¸ Pause Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { pauseEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('ğŸ”ˆï¸ Pause the current song'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        if (queue.node.isPaused()) {
            return interaction.reply({
                embeds: [errorEmbed('The song is already paused! Use `/resume`.', client)],
                ephemeral: true,
            });
        }

        queue.node.pause();
        
        return interaction.reply({ embeds: [pauseEmbed(queue.currentTrack, client)] });
    },
};