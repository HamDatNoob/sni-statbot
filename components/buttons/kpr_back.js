const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listKpr } = require("../../scripts/listKpr.js");

module.exports = {
    name: "kpr_back",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => (b.kills / b.rounds) - (a.kills / a.rounds)); // SORTS BY KPR

        const pg = parseInt(interaction.message.embeds[0].title.slice(22)) - 1;

        listKpr(pg - 1, stats, interaction);
    }
}