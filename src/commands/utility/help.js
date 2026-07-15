// =======================================
// 🔊 Help Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { helpEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('🔊 Show all available commands'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const { embed, components } = helpEmbed(client, 'music');
        await interaction.reply({ embeds: [embed], components });
    },
};