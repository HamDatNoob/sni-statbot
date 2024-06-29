const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listKpr } = require("../../scripts/listKpr.js");

module.exports = {
    name: "kpr_first",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => (b.kills / b.rounds) - (a.kills / a.rounds)); // SORTS BY KPR

        listKpr(0, stats, interaction);
    }
}