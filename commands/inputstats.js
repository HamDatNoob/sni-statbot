const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inputstats')
    .setDescription('Add stats from the game into the database')
    .addStringOption(option => option
        .setName('stats')
        .setDescription('The stats from /exportstats, plaintext')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('map')
        .setDescription('The map the game was played on')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const exportedStats = interaction.options.getString('stats');
        let map = interaction.options.getString('map');

        const splitStats = exportedStats.split(" ").filter(v => v);

        if(splitStats.length < 57) return interaction.followUp({ content: "**Parsing Error:** Not enough players/elements!", ephemeral: true });
        if(splitStats.length > 57) return interaction.followUp({ content: "**Parsing Error:** Too many players/elements! (Possible Fix: remove \` - MAP\` from top of stats)", ephemeral: true });

        const indexOfA = splitStats.indexOf("A");
        const indexOfB = splitStats.indexOf("B");
        
        const aStats = splitStats.slice(indexOfA, indexOfB);
        const bStats = splitStats.slice(indexOfB);

        const aScore = aStats[1];
        const bScore = bStats[1];

        if((aScore != 12 && bScore != 12) || (aScore == 12 && bScore == 12)) return interaction.followUp({ content: "**Parsing Error:** No winning team!", ephemeral: true });

        const currentWeek = await db.get("currentWeek");
        const validMaps = await db.get(`maps.${currentWeek}`);

        if(!validMaps.map(e => e.toLowerCase()).includes(map.toLowerCase())) return interaction.followUp({ content: "**Parsing Error:** Invalid map!", ephemeral: true });

        const aPlayerStats = [ {}, {}, {}, {}, {} ];
        const bPlayerStats = [ {}, {}, {}, {}, {} ];

        let aWon = false;

        for(let i = 0; i < 5; i++){
            // A PLAYERS
            const aUsername = aStats[5 * i + 2].toLowerCase();
            const aStat = aStats[5 * i + 3];
            const aKills = aStat.split("-")[0];
            const aDeaths = aStat.split("-")[1];
            const aDiff = aStats[5 * i + 4];
            const aHsr = aStats[5 * i + 5];
            const aRate = aStats[5 * i + 6];

            if(aScore == 12) aWon = true;

            if(await db.get(`stats.${aUsername}`) == undefined) return interaction.followUp({ content: `**Parsing Error:** \`${aUsername}\` is not registered!`, ephemeral: true });

            aPlayerStats[i].username = aUsername;
            aPlayerStats[i].stats = aStat;
            aPlayerStats[i].kills = aKills;
            aPlayerStats[i].deaths = aDeaths;
            aPlayerStats[i].diff = aDiff;
            aPlayerStats[i].hsr = aHsr;
            aPlayerStats[i].rate = aRate;
            aPlayerStats[i].won = aWon;

            // B PLAYERS
            const bUsername = bStats[5 * i + 2].toLowerCase();
            const bStat = bStats[5 * i + 3];
            const bKills = bStat.split("-")[0];
            const bDeaths = bStat.split("-")[1];
            const bDiff = bStats[5 * i + 4];
            const bHsr = bStats[5 * i + 5];
            const bRate = bStats[5 * i + 6];
            
            if(await db.get(`stats.${bUsername}`) == undefined) return interaction.followUp({ content: `**Parsing Error:** \`${bUsername}\` is not registered!`, ephemeral: true });

            bPlayerStats[i].username = bUsername;
            bPlayerStats[i].stats = bStat;
            bPlayerStats[i].kills = bKills;
            bPlayerStats[i].deaths = bDeaths;
            bPlayerStats[i].diff = bDiff;
            bPlayerStats[i].hsr = bHsr;
            bPlayerStats[i].rate = bRate;
            bPlayerStats[i].won = !aWon;
        }

        const rounds = parseInt(aScore) + parseInt(bScore);

        const aps = aPlayerStats.concat(bPlayerStats);

        for(let i in aps){
            await db.add(`stats.${aps[i].username}.kills`, aps[i].kills);
            await db.add(`stats.${aps[i].username}.deaths`, aps[i].deaths);
            await db.add(`stats.${aps[i].username}.rounds`, rounds);
            await db.add(`stats.${aps[i].username}.games`, 1);
            if(aps[i].won) await db.add(`stats.${aps[i].username}.gameWins`, 1);
        }

        map = map.charAt(0).toUpperCase() + map.slice(1);

        async function playerStats(stats){
            return `${await db.get(`stats.${stats.username}.username`)} ${stats.stats} ${stats.diff} ${stats.hsr} ${stats.rate}\n`;
        }

        async function makeStats(){
            let output = `\`\`\`\nCops vs Crims - ${map}\nA ${aScore}\n`;

            // TEAM A STATS
            for(let i in aPlayerStats){
                output += await playerStats(aPlayerStats[i]);
            }

            output += `\nB ${bScore}\n`;
            
            // TEAM B STATS
            for(let i in bPlayerStats){
                output += await playerStats(bPlayerStats[i]);
            }

            output += `\`\`\``;

            return output;
        }

        interaction.followUp({ content: await makeStats() });
    }
}