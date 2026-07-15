// =======================================
// 🔊 Volume Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🔊 Set the playback volume (1-200)')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (1-200)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(200)
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

        const vol = interaction.options.getInteger('level');
        
        queue.node.setVolume(vol);
        
        const emoji = vol > 100 ? 'e('volume_up')' : vol < 50 ? 'e('volume_down')' : 'e('volume_mute')';
        
        return interaction.reply({
            embeds: [successEmbed(`🔊 Volume set to **${vol}%**!`, client)],
        });
    },
};