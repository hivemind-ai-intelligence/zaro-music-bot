// =======================================
// 🔔 Replay Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('🔔 Replay the current song from the beginning'),
    
    cooldown: 2,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                embeds: [errorEmbed('No song playing!', client)],
                ephemeral: true,
            });
        }

        try {
            await queue.node.seek(0);
        } catch (err) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to replay!', client)],
                ephemeral: true,
            });
        }

        return interaction.reply({
            embeds: [successEmbed(`🔔 Replaying **<a href="replay">${queue.currentTrack.title}</a>  ** 🎆 Previous song is replaying!`, client)],
        });
    },
};