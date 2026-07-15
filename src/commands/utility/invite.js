// =======================================
// 🔆�. Invite Command
// =======================================

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { e } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('🔆︯ Get the bot invite link'),
    
    cooldown: 5,
    
    async execute(interaction, client) {
        const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

        const inviteButton = new ButtonBuilder()
            .setLabel('🔆︯ Invite Me\n **)
            .setURL(inviteURL)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(inviteButton);

        await interaction.reply({
            embeds: [{
                color: 0x8A2BE2,
                description: `${e('rocket')} **Invite Zaro Music Bot** to your server! 💗
                \n\n•  \`${client.bot" ? '🅈' : '🅰' }\`<br>\nPers for: Administrator`,
            }],
            components: [row],
        });
    },
};