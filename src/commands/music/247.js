// ==============================================
// 🕐 /247 - Toggle 24/7 mode
// ==============================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { mode247Embed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('🕐 Toggle 24/7 mode (bot stays even when empty)')
        .setDMPermission(false),

    cooldown: 5,

    async execute(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [errorEmbed('You need to be in a voice channel!', client)],
                ephemeral: true
            });
        }

        if (!client._247) client._247 = new Map();
        
        const current = client._247.get(interaction.guild.id) || false;
        const newMode = !current;
        
        client._247.set(interaction.guild.id, newMode);

        // Update any existing player
        const queue = useQueue(interaction.guild.id);
        if (queue) {
            if (newMode) {
                queue.options.leaveOnEmpty = false;
                queue.options.leaveOnEnd = false;
            } else {
                queue.options.leaveOnEmpty = true;
                queue.options.leaveOnEnd = true;
            }
        }

        return interaction.reply({ embeds: [mode247Embed(newMode, client)] });
    }
};