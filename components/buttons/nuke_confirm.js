const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "nuke_confirm",
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = await db.get(`stats`);

        for(let i in stats){
            const username = stats[i].username;

            await db.set(`stats.${username}.kills`, 0);
            await db.set(`stats.${username}.deaths`, 0);
            await db.set(`stats.${username}.gameWins`, 0);
            await db.set(`stats.${username}.games`, 0);
            await db.set(`stats.${username}.rounds`, 0);
            await db.set(`stats.${username}.weekWins`, 0);
            await db.set(`stats.${username}.participated`, 0);
        }

        return interaction.followUp({ content: "Database successfully nuked", components: [], ephemeral: true });
    }
}