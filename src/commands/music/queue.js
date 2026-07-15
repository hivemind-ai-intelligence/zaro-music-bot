// =======================================
// 📋 Queue Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { queueEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('📋 View the server queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Q ueue Page number')
                .setRequired(false)
                .setMinValue(1)
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

        const page = interaction.options.getInteger('page') || 1;
        const embed = queueEmbed(queue, page, client);
        
        return interaction.reply({ embeds: [embed] });
    },
};