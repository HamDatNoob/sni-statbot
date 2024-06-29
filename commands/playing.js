const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playing')
    .setDescription('Increment every participating player\'s participation counter')
    .addStringOption(option => option
        .setName('username1')
        .setDescription('player 1')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username2')
        .setDescription('player 2')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username3')
        .setDescription('player 3')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username4')
        .setDescription('player 4')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username5')
        .setDescription('player 5')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username6')
        .setDescription('player 6')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username7')
        .setDescription('player 7')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username8')
        .setDescription('player 8')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username9')
        .setDescription('player 9')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username10')
        .setDescription('player 10')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username11')
        .setDescription('player 11')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username12')
        .setDescription('player 12')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username13')
        .setDescription('player 13')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username14')
        .setDescription('player 14')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username15')
        .setDescription('player 15')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username16')
        .setDescription('player 16')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username17')
        .setDescription('player 17')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username18')
        .setDescription('player 18')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username19')
        .setDescription('player 19')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('username20')
        .setDescription('player 20')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const players = [];
        for(let i = 0; i < 20; i++){
            players.push(interaction.options.getString(`username${i + 1}`));

            if(await db.get(`stats.${players[i]}`) == undefined) return interaction.followUp({ content: `\`${players[i]}\` is not registered!`, ephemeral: true });
        }

        for(let i in players){
            await db.add(`stats.${players[i]}.participated`, 1);
        }

        return interaction.followUp({ content: `Incremented all 20 players' participation count!` });
    }
}