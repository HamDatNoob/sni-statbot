const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listKdr } = require("../../scripts/listKdr.js");

module.exports = {
    name: "kdr_next",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => (b.kills / b.deaths) - (a.kills / a.deaths)); // SORTS BY KDR

        const pg = parseInt(interaction.message.embeds[0].title.slice(22)) - 1;

        listKdr(pg + 1, stats, interaction);
    }
}