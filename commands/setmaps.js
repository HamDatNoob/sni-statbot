const { QuickDB } = require("quick.db");
const { staffId } = require("../config.json");
const db = new QuickDB();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setmaps')
    .setDescription('Set the available maps for the week')
    .addIntegerOption(option => option
        .setName('week')
        .setDescription('Week to set the available maps for')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('map1')
        .setDescription('Input map 1 exactly as named in CVC (NOT CS)')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('map2')
        .setDescription('Input map 2 exactly as named in CVC (NOT CS)')
        .setRequired(true)
    )    
    .addStringOption(option => option
        .setName('map3')
        .setDescription('Input map 3 exactly as named in CVC (NOT CS)')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('map4')
        .setDescription('Input map 4 exactly as named in CVC (NOT CS)')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('map5')
        .setDescription('Input map 5 exactly as named in CVC (NOT CS)')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const week = interaction.options.getInteger("week");
        let map1 = interaction.options.getString("map1");
        let map2 = interaction.options.getString("map2");
        let map3 = interaction.options.getString("map3");
        let map4 = interaction.options.getString("map4");
        let map5 = interaction.options.getString("map5");

        const maps = [map1, map2, map3, map4, map5];

        for(let i in maps){
            await db.add(`maps.options.${maps[i]}.inPool`, 1);

            maps[i].toLowerCase();
        }

        await db.set(`maps.weeks.${week}`, maps);

        interaction.reply({ content: `Available maps for week ${week} are now: \`\"${map1}\", \"${map2}\", \"${map3}\", \"${map4}\", \"${map5}\"\`` });
    }
}