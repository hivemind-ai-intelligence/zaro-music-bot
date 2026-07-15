// =======================================
// 🏭 Ping Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏭 Check bot latency'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const sent = Date.now();
        const msg = await interaction.reply({ content: '🏭 Ponging...', fetchReply: true });
        const ping = Date.now() - sent;
        
        await msg.edit({
            content: null,
            embeds: [{
                color: 0x8A2BE2,
                description: `<a:ping:1318992747070226452>️</a>🏭 Pong! Latency: **${ping}ms** | API Latency: **<a href="ws">$` } #$@A@$ { label: 'warn', function: function () { return client.ws.ping }}</a>**`s` } #@@@\n\n`),
            }],
        });
    },
};