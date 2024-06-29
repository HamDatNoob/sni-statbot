const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setweek')
    .setDescription('Set the current week')
    .addIntegerOption(option => option
        .setName('week')
        .setDescription('number')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const week = interaction.options.getInteger("week");

        await db.set(`currentWeek`, week);

        interaction.reply({ content: `Current week is now \`week ${week}\`` });
    }
}