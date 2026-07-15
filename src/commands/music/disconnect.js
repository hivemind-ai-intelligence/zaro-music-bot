// =======================================
// 🎮 Disconnect Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { getVoiceConnection } = require('@discordjs/voice');
const { stopEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('🎮 Leave the voice channel and clear queue'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue) {
            return interaction.reply({
                embeds: [errorEmbed('I am not in a voice channel!', client)],
                ephemeral: true,
            });
        }

        const voiceChannel = queue.channel;
        
        // Clear 24/7 status
        client._247?.delete(interaction.guildId);
        
        // Delete queue
        queue.delete();
        
        return interaction.reply({ embeds: [stopEmbed(client)] });
    }
};