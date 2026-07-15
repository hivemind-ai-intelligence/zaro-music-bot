// ==============================================
// 🔄 /autoplay - Toggle autoplay mode
// ==============================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('🔄 Toggle autoplay (auto-play related songs)')
        .setDMPermission(false),

    cooldown: 2,

    async execute(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [errorEmbed('You need to be in a voice channel!', client)],
                ephemeral: true
            });
        }

        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('Nothing is playing right now!', client)],
                ephemeral: true
            });
        }

        const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;
        
        if (isAutoplay) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            return interaction.reply({
                embeds: [successEmbed(`${e('error')} **Autoplay disabled!**`, client)]
            });
        } else {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            return interaction.reply({
                embeds: [successEmbed(`${e('arrows_clockwise')} **Autoplay enabled!** I'll play related songs when queue ends.`, client)]
            });
        }
    }
};