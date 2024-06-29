const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: 'kpr_search',
    async execute(interaction){
        const modal = new ModalBuilder()
            .setCustomId('kpr_search')
            .setTitle('Leaderboard Page Search');

        const pageInput = new TextInputBuilder()
            .setCustomId('kpr_search_pageInput')
            .setLabel('Page Number? (Only fill one field)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const usernameInput = new TextInputBuilder()
            .setCustomId('kpr_search_usernameInput')
            .setLabel('Username? (Only fill one field)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const row1 = new ActionRowBuilder()
            .addComponents(pageInput);
        
        const row2 = new ActionRowBuilder()
            .addComponents(usernameInput);

        modal.addComponents(row1, row2);

        return interaction.showModal(modal);
    }
}