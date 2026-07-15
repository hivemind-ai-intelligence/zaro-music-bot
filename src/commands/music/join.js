// =======================================
// 🍤 Join Voice Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { joinVoiceChannel } = require('@discordjs/voice');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🍤 Join your voice channel'),
    
    cooldown: 3,
    
    async execute(interaction, client) {
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [errorEmbed('You need to be in a voice channel!', client)],
                ephemeral: true,
            });
        }

        const perms = voiceChannel.permissionsFor(client.user);
        if (!perms.has('Connect') || !perms.has('Speak')) {
            return interaction.reply({
                embeds: [errorEmbed('I need "Connect" and "Speak" permissions!', client)],
                ephemeral: true,
            });
        }

        try {
            await joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: client.voice.adapterCreator,
            });
            return interaction.reply({
                embeds: [successEmbed(`🍤 Joined **{voiceChannel.name}**! 🎨', client)],
            });
        } catch (err) {
            return interaction.reply({
                embeds: [errorEmbed('Failed to join voice channel!', client)],
                ephemeral: true,
            });
        }
    },
};