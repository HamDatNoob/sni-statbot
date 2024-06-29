const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listParticipation } = require("../../scripts/listParticipation.js");

module.exports = {
    name: "participation_last",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => b.particpated - a.participated); // SORTS BY PARTICPATION

        listParticipation(Math.floor(stats.length / 10), stats, interaction);
    }
}