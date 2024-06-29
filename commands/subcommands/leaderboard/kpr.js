const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listKpr } = require("../../../scripts/listKpr.js");

module.exports = {
    async execute(interaction){
        await interaction.deferReply();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => (b.kills / b.rounds) - (a.kills / a.rounds)); // SORTS BY KPR

        await listKpr(0, stats, interaction);
    }
}