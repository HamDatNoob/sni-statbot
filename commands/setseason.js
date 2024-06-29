const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setseason')
    .setDescription('Set the current season')
    .addIntegerOption(option => option
        .setName('season')
        .setDescription('number')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const season = interaction.options.getInteger("season");

        await db.set(`currentSeason`, season);

        interaction.reply({ content: `Current season is now \`${season}\`` });
    }
}