const { hamId } = require("../config.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Resets the entire database'),
    async execute(interaction){
        if(!interaction.user.id == hamId) return interaction.reply({ content: "You cannot use this command!", ephemeral: true });

        const confirm = new ButtonBuilder()
        .setCustomId('nuke_confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
        .addComponents(confirm);

        return interaction.reply({ content: "Have you backed up the database yet? If not, DO THAT!", components: [row] });
    }
}