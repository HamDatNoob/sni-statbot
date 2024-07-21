const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('editstats')
    .setDescription('Change a player\'s stats')
    .addStringOption(option => option
        .setName('username')
        .setDescription('player')
        .setRequired(true)
    )
    .addIntegerOption(option => option
        .setName('kills')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('deaths')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('gamewins')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('games')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('rounds')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('weekwins')
        .setDescription('new value')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('participated')
        .setDescription('new value')
        .setRequired(false)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const username = interaction.options.getString('username').toLowerCase();

        if(await db.get(`stats.${username}`) == undefined) return interaction.followUp({ content: `\`${username}\` is not registered!`, ephemeral: true });

        const kills = interaction.options.getInteger('kills') ?? await db.get(`stats.${username}.kills`);
        const deaths = interaction.options.getInteger('deaths') ?? await db.get(`stats.${username}.deaths`);
        const gameWins = interaction.options.getInteger('gamewins') ?? await db.get(`stats.${username}.gameWins`);
        const games = interaction.options.getInteger('games') ?? await db.get(`stats.${username}.games`);
        const rounds = interaction.options.getInteger('rounds') ?? await db.get(`stats.${username}.rounds`);
        const weekWins = interaction.options.getInteger('weekwins') ?? await db.get(`stats.${username}.weekWins`);
        const participated = interaction.options.getInteger('participated') ?? await db.get(`stats.${username}.participated`);

        await db.set(`stats.${username}.kills`, kills);
        await db.set(`stats.${username}.deaths`, deaths);
        await db.set(`stats.${username}.gameWins`, gameWins);
        await db.set(`stats.${username}.games`, games);
        await db.set(`stats.${username}.rounds`, rounds);
        await db.set(`stats.${username}.weekWins`, weekWins);
        await db.set(`stats.${username}.participated`, participated);

        return interaction.followUp({ content: `Changed \`${await db.get(`stats.${username}.username`)}\`'s stats!` });
    }
}