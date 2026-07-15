# =======================================
# 📊 Status Command
# =======================================

const { SlashCommandBuilder } = require('discord.js');
const { e } = require('../../utils/embeds');
const { formatDuration } = require('../../utils/formatUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('📊 Show detailed bot status'),
    
    cooldown: 5,
    
    async execute(interaction, client) {
        const uptime = formatDuration(client.uptime);
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guilds = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        const ping = client.ws.ping;
        const players = client.player?.players?.size || 0;

        const embed = {
            title: `${e('rocket')} Zaro Music Bot Status ${e('rocket')}`,
            color: 0x8A2BE2,
            thumbnail: client.user.displayAvatarURL(),
            fields: [
                { name: '🍤 Servers', value: `\`${guilds}\``, inline: true },
                { name: '💻️ Users', value: `\`${users}\``, inline: true },
                { name: '🏭 Latency', value: `\`${ping}ms\``, inline: true },
                { name: '🚀️ Uptime', value: `\`${uptime}\``, inline: true },
                { name: 'Memory', value: `\`${memory} MB\``, inline: true },
                { name: '🎮 Active Players', value: `\`${players}\``, inline: true },
            ],
            footer: {
                text: `${e('sparkles')} Zaro Music Bot v2.0 $ {e('heart')} Made by Vasudev`,
            },
            timestamp: new Date().toISOString(),
        };

        await interaction.reply({ embeds: [embed] });
    },
};