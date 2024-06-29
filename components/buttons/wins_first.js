const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listWins } = require("../../scripts/listWins.js");

module.exports = {
    name: "wins_first",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => b.weekWins - a.weekWins); // SORTS BY WINS

        listWins(0, stats, interaction);
    }
}