// =======================================
// ⶣ️ Prefix Command
// =======================================

const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed, e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('ⶣ️ Change the bot prefix')
        .addStringOption(option =>
            option.setName('newPrefix')
                .setDescription('The new prefix for the bot')
                .setRequired(true)
        ),
    
    cooldown: 5,
    
    async execute(interaction, client) {
        const newPrefix = interaction.options.getString('newPrefix');
        
        if (newPrefix.length > 5) {
            return interaction.reply({
                embeds: [errorEmbed('Prefix must be 5 characters or less!', client)],
                ephemeral: true,
            });
        }

        if (!client.guildPreferences) client.guildPreferences = new Map();
        
        const guildPrefs = client.guildPreferences.get(interaction.guildId) || {};
        guildPrefs.prefix = newPrefix;
        client.guildPreferences.set(interaction.guildId, guildPrefs);

        return interaction.reply({
            embeds: [successEmbed(`ⶣ️ Prefix changed to **${newPrefix}**`, client)],
        });
    },
};