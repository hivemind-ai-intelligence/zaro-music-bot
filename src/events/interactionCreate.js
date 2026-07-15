// =======================================
// 🦎 INTERACTION CREATE - Slash Commands & Buttons
// =======================================

const { handleSlashCommand } = require('../handlers/commandHandler');
const { helpEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            return handleSlashCommand(interaction);
        }

        // Handle Autocomplete
        if (interaction.isAutocomplete()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (command?.autocomplete) {
                try {
                    await command.autocomplete(interaction, client);
                } catch (err) {
                    logger.error(`Autocomplete error for ${interaction.commandName}:`, err.message);
                }
            }
            return;
        }

        // Handle String Select Menu (Help)
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'help_category') {
                const category = interaction.values[0];
                const { embed, components } = helpEmbed(client, category);
                await interaction.update({ embeds: [embed], components }).catch(() => {});
            }
            return;
        }

        // Handle Buttons
        if (interaction.isButton()) {
            const customId = interaction.customId;
            
            // Lyrics pagination
            if (customId.startsWith('lyrics_')) {
                const [_, action, currentPage, totalPages, title, artist, thumbnail] = customId.split('|');
                const { lyricsEmbed: buildLyrics, lyrics: storedLyrics } = require('../utils/embeds');
                
                const lyrics = client._lyricsCache?.get(interaction.message.id);
                if (!lyrics) {
                    return interaction.reply({ content: '❌ Lyrics expired! Use `/lyrics` again.', ephemeral: true });
                }
                
                let newPage = parseInt(currentPage);
                if (action === 'prev') newPage = Math.max(1, newPage - 1);
                if (action === 'next') newPage = Math.min(parseInt(totalPages), newPage + 1);
                
                const { embed } = buildLyrics(title, artist, lyrics, newPage, parseInt(totalPages), thumbnail, client);
                await interaction.update({ embeds: [embed] }).catch(() => {});
            }
            
            return;
        }
    }
};