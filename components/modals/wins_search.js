const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { listWins } = require("../../scripts/listWins.js");

module.exports = {
    async execute(interaction){
        await interaction.deferUpdate();

        const stats = Object.values(await db.get("stats"));
        stats.sort((a, b) => b.weekWins - a.weekWins); // SORTS BY WINS

        let pg = parseInt(interaction.fields.getTextInputValue('wins_search_pageInput')) - 1;

        if(pg > Math.floor(stats.length / 10)) pg = Math.floor(stats.length / 10);
        if(pg < 0) pg = 0;

        if(isNaN(pg)){
            const username = interaction.fields.getTextInputValue('wins_search_usernameInput').toLowerCase();

            for(let i = 0; i < stats.length; i++){                
                if(stats[i].username == username.toLowerCase()){
                    pg = Math.ceil((i + 1) / 10) - 1;
                }
            }

            if(isNaN(pg)){
                pg = 0;
                await interaction.followUp({ content: `\`${username}\` is not on this leaderboard!`, ephemeral: true });
            }
        }

        listWins(pg, stats, interaction);
    }
}