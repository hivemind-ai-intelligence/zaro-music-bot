// =======================================
// ⚕ 🎮 Filters Command
// =======================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('List all available audio filters'),
    
    async execute(interaction, client) {
        const filters = {
            '📈 Bass Control': 'bassboost, equalizer',
            '⚡ Speed & Pitch': 'speed',
            '📈 Visual Effects': 'nightcore, vaporwave, 8d, karaoke',
            '🏖 Modulation': 'echo, tremolo',
        };

        let description = `${e('zap')} **Available Audio Filters** ${e('zap')}\n\n`;

        for (const [category, filterList] of Object.entries(filters)) {
            description += `**${category}**: \`${filterList}\`\n`;
        }

        description += `\n${e('arrow_right')} Use the commands above to toggle effects! 🎨`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${e('gear')} Audio Filters ${e('zap')}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(description)
            .setColor(0x8A2BE2)
            .setFooter({ text: 'Zaro Music Bot • 10+ Audio Filters' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};