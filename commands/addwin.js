const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addwin')
    .setDescription('Increment every player\'s week wins counter')
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
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const players = [];
        for(let i = 0; i < 5; i++){
            players.push(interaction.options.getString(`username${i + 1}`));

            if(await db.get(`stats.${players[i]}`) == undefined) return interaction.followUp({ content: `\`${players[i]}\` is not registered!`, ephemeral: true });
        }

        for(let i in players){
            await db.add(`stats.${players[i]}.weekWins`, 1);
        }

        return interaction.followUp({ content: `Incremented all 5 players' week wins count!` });
    }
}