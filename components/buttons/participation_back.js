const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listParticipation } = require("../../scripts/listParticipation.js");

module.exports = {
    name: "participation_back",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => b.participated - a.participated); // SORTS BY PARTICIPATION

        const pg = parseInt(interaction.message.embeds[0].title.slice(32)) - 1;

        listParticipation(pg - 1, stats, interaction);
    }
}