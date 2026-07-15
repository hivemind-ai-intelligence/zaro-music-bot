// =======================================
// ⚕ 🎮 Seek Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');
const { formatDuration } = require('../../utils/formatUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('⚍ Seek to a position in the song')
        .addStringOption(option =>
            option.setName('position')
                .setDescription('Position (e.g. 1m30s, 90s, or 300)')
                .setRequired(true)
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

        const posInput = interaction.options.getString('position');
        const parsedTime = parseTime(posInput);
        
        if (!parsedTime || parsedTime < 0) {
            return interaction.reply({
                embeds: [errorEmbed('Invalid time! Use format like 1m30s or 90s.', client)],
                ephemeral: true,
            });
        }

        if (parsedTime > queue.currentTrack.durationMS) {
            return interaction.reply({
                embeds: [errorEmbed(`Cannot seek beyond the song duration (${formatDuration(queue.currentTrack.durationMS)}).`, client)],
                ephemeral: true,
            });
        }

        queue.node.seek(parsedTime);
        return interaction.reply({
            embeds: [successEmbed(`⚍ Seeked to **<a href="seek">${
                formatDuration(parsedTime)
            }</a> **`, client)],
        });
    },
};