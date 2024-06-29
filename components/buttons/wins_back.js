const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listWins } = require("../../scripts/listWins.js");

module.exports = {
    name: "wins_back",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => b.weekWins - a.weekWins); // SORTS BY WINS

        const pg = parseInt(interaction.message.embeds[0].title.slice(28)) - 1;

        listWins(pg - 1, stats, interaction);
    }
}