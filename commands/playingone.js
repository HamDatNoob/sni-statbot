const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playingone')
    .setDescription('Increment one player\'s participation counter')
    .addStringOption(option => option
        .setName('username')
        .setDescription('player')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const player = interaction.options.getString('username');

        if(await db.get(`stats.${player}`) == undefined) return interaction.followUp({ content: `\`${aUsername}\` is not registered!`, ephemeral: true });

        await db.add(`stats.${player}.participated`, 1);
        
        return interaction.followUp({ content: `Incremented \`${player}\`'s participation count!` });
    }
}