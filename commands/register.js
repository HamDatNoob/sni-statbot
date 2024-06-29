const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Links a Minecraft Account to your Discord Account')
    .addStringOption(option => option
        .setName('username')
        .setDescription('The username to link to your account')
        .setRequired(true)
    ),
    async execute(interaction){
        const usernameCaps = interaction.options.getString("username");
        const discordId = interaction.user.id;

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