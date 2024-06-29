const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listKdr } = require("../../scripts/listKdr.js");

module.exports = {
    name: "kdr_first",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => (b.kills / b.deaths) - (a.kills / a.deaths)); // SORTS BY KDR

        listKdr(0, stats, interaction);
    }
}