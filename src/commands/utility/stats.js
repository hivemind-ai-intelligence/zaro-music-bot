// =======================================
// 📊 Stats Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { statsEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('📊 Show bot statistics'),
    
    cooldown: 5,
    
    async execute(interaction, client) {
        const embed = statsEmbed(client, client.player);
        await interaction.reply({ embeds: [embed] });
    },
};