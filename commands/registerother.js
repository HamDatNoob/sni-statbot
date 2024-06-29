const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('registerother')
    .setDescription('Links another person\'s Minecraft Account to their Discord Account')
    .addStringOption(option => option
        .setName('username')
        .setDescription('The Minecraft Username of the account to link')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('discordid')
        .setDescription('The Discord ID of the account to link')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const usernameCaps = interaction.options.getString("username");
        const discordId = interaction.options.getString("discordid");

        const username = usernameCaps.toLowerCase();

        const existingCheck = await db.get(`links.${discordId}`);
        if(existingCheck != undefined) return interaction.reply({ content: `\`${discordId}\` is already linked to \`${existingCheck}\`!`, ephemeral: true });

        await db.set(`links.${discordId}`, username);
        await db.set(`stats.${username}.kills`, 0);
        await db.set(`stats.${username}.deaths`, 0);
        await db.set(`stats.${username}.gameWins`, 0);
        await db.set(`stats.${username}.games`, 0);
        await db.set(`stats.${username}.rounds`, 0);
        await db.set(`stats.${username}.weekWins`, 0);
        await db.set(`stats.${username}.participated`, 0);
        await db.set(`stats.${username}.username`, usernameCaps);
        await db.set(`stats.${username}.id`, discordId);

        return interaction.reply({ content: `\`${usernameCaps}\` is now linked to \`${discordId}\`!` });
    }
}