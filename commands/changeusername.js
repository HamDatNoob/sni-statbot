const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('changeusername')
    .setDescription('Exports the current database')
    .addStringOption(option => option
        .setName("oldname")
        .setDescription("The user's old username")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("newname")
        .setDescription("The user's new username")
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const oldName = interaction.options.getString('oldname').toLowerCase();

        const newNameCaps = interaction.options.getString('newname');
        const oldNameCaps = await db.get(`stats.${oldName}.username`);

        if(oldNameCaps == undefined) return interaction.reply({ content: `\`${oldName}\` does not exist!`, ephemeral: true });

        const newName = newNameCaps.toLowerCase();

        const weekWins = parseInt(await db.get(`stats.${oldName}.weekWins`));
        const kills = parseInt(await db.get(`stats.${oldName}.kills`));
        const deaths = parseInt(await db.get(`stats.${oldName}.deaths`));
        const wins = parseInt(await db.get(`stats.${oldName}.gameWins`));
        const games = parseInt(await db.get(`stats.${oldName}.games`));
        const rounds = parseInt(await db.get(`stats.${oldName}.rounds`));
        const participated = parseInt(await db.get(`stats.${oldName}.participated`));
        const id = await db.get(`stats.${oldName}.id`);

        await db.delete(`stats.${oldName}`);

        await db.set(`links.${id}`, newName);
        await db.set(`stats.${newName}.id`, id);
        await db.set(`stats.${newName}.username`, newNameCaps);
        await db.set(`stats.${newName}.weekWins`, weekWins);
        await db.set(`stats.${newName}.kills`, kills);
        await db.set(`stats.${newName}.deaths`, deaths);
        await db.set(`stats.${newName}.gameWins`, wins);
        await db.set(`stats.${newName}.games`, games);
        await db.set(`stats.${newName}.rounds`, rounds);
        await db.set(`stats.${newName}.participated`, participated); 

        return interaction.reply({ content: `\`${oldNameCaps}\`'s username changed to \`${newNameCaps}\`!` });
    }
}