const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('changediscordid')
    .setDescription('Exports the current database')
    .addStringOption(option => option
        .setName("oldid")
        .setDescription("The user's old Discord ID")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("newid")
        .setDescription("The user's new Discord ID")
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const oldId = interaction.options.getString('oldid');
        const newId = interaction.options.getString('newid');

        const username = await db.get(`links.${oldId}`);

        if(username == undefined) return interaction.reply({ content: `\`${oldId}\` does not exist!`, ephemeral: true });

        await db.delete(`links.${oldId}`);

        await db.set(`links.${newId}`, username);
        await db.set(`stats.${username}.id`, newId);

        return interaction.reply({ content: `Discord ID \`${oldId}\` changed to \`${newId}\`!` });
    }
}