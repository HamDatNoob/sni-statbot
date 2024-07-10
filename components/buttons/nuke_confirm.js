const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("discord.js");
const { hamId, statsChannelId } = require("../../config.json");

module.exports = {
    name: "nuke_confirm",
    async execute(interaction){
        if(!interaction.user.id == hamId) return interaction.followUp({ content: "You cannot use this command!", ephemeral: true });

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

        await interaction.client.channels.cache.get(statsChannelId).messages.fetch({ limit: 100 }).then(messages => {
            interaction.client.channels.cache.get(statsChannelId).bulkDelete(messages).catch(() => {
                messages.forEach(msg => {
                    msg.delete();
                });
            });
        });

        return interaction.editReply({ content: "Database and stats channel successfully nuked", components: [] });
    }
}