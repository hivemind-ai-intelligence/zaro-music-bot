// =======================================
// 👑 Guilds Command (Owner Only)
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('👑 List all servers the bot is in'),
    
    cooldown: 10,
    ownerOnly: true,
    
    async execute(interaction, client) {
        if (!config.ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ Owner only!', ephemeral: true });
        }

        const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount);
        let description = '';

        guilds.forEach((g, i) => {
            description += `**${i + 1}.** ${g.name} - \`${g.memberCount}\` members\n`;
        });

        const embed = {
            title: '👑 Servers',
            description: description || 'No servers found',
            color: 0x8A2BE2,
            footer: { text: `Total: ${guilds.size} servers` },
        };

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};