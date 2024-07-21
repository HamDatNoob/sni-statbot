const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId, captainId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('resetcaps')
    .setDescription('reset the 4 team captains (if there was a problem)'),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const nicknames = await db.get('captains');

        if(nicknames === undefined || nicknames.length == 0) return interaction.reply({ content: "Nothing to reset.", ephemeral: true });

        await interaction.deferReply();

        const captain = await interaction.guild.roles.cache.get(captainId);

        await interaction.guild.members.fetch({ limit: 1000 }).then(members => {
            for(let obj of nicknames){
                members.get(obj.id).setNickname(obj.nickname);
                members.get(obj.id).roles.remove(captain);
            }
        });

        await db.set('captains', []);

        return interaction.editReply({ content: `Captains have been reset.` });
    }
}