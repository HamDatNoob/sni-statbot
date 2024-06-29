const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { hamId } = require("../config.json");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('export')
    .setDescription('Exports the current database'),
    async execute(interaction){
        if(!interaction.user.id == hamId) return interaction.reply({ content: "You cannot use this command!", ephemeral: true });

        const season = await db.get('currentSeason');

        const attachment = new AttachmentBuilder('json.sqlite');

        return interaction.reply({ content: `Database from season \`${season}\`:`, files: [ attachment ] })
    }
}