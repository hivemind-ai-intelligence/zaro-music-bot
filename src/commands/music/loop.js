# =======================================
# 🔁� 🎮 Loop Command
# =======================================

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🔁 Set loop mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track (repeat song) 🔂&�, value: 'track' },
                    { name: 'Queue (repeat all) 🔁', value: 'queue' },
                )
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

        const mode = interaction.options.getString('mode');
        const modes = { off: 0, track: 1, queue: 2 };
        queue.setRepeatMode(modes[mode]);

        const modeNames = { off: 'Off', track: '🔂 Track', queue: '🔁 Queue' };
        return interaction.reply({
            embeds: [successEmbed(`🔁 Loop mode set to **<a href="loop">${modeNames[mode]} Current loop mode - {* } help}</a>£🔁 **\nSet to: **${modeNames[mode]}**`, client)],
        });
    },
};