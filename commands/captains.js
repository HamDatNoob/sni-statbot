const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId, captainId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('captains')
    .setDescription('Set the 4 team captains (captain A picks first)')
    .addUserOption(option => option
        .setName('captaina')
        .setDescription('captain a')
        .setRequired(true)
    ).addUserOption(option => option
        .setName('captainb')
        .setDescription('captain b')
        .setRequired(true)
    ).addUserOption(option => option
        .setName('captainc')
        .setDescription('captain c')
        .setRequired(true)
    ).addUserOption(option => option
        .setName('captaind')
        .setDescription('captain d')
        .setRequired(true)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        await interaction.deferReply();

        const captainA = interaction.options.getUser('captaina');
        const captainB = interaction.options.getUser('captainb');
        const captainC = interaction.options.getUser('captainc');
        const captainD = interaction.options.getUser('captaind');

        const memberA = interaction.guild.members.cache.get(captainA.id);
        const memberB = interaction.guild.members.cache.get(captainB.id);
        const memberC = interaction.guild.members.cache.get(captainC.id);
        const memberD = interaction.guild.members.cache.get(captainD.id);

        const nicknameA = memberA.nickname ?? memberA.user.globalName ?? memberA.user.username;
        const nicknameB = memberB.nickname ?? memberB.user.globalName ?? memberB.user.username;
        const nicknameC = memberC.nickname ?? memberC.user.globalName ?? memberC.user.username;
        const nicknameD = memberD.nickname ?? memberD.user.globalName ?? memberD.user.username;

        await db.set('captains', [{ nickname: nicknameA, id: captainA.id }, { nickname: nicknameB, id: captainB.id }, { nickname: nicknameC, id: captainC.id }, { nickname: nicknameD, id: captainD.id }]);

        await memberA.setNickname(`[A] ${nicknameA}`);
        await memberB.setNickname(`[B] ${nicknameB}`);
        await memberC.setNickname(`[C] ${nicknameC}`);
        await memberD.setNickname(`[D] ${nicknameD}`);

        const captain = await interaction.guild.roles.cache.get(captainId);

        await memberA.roles.add(captain);
        await memberB.roles.add(captain);
        await memberC.roles.add(captain);
        await memberD.roles.add(captain);

        return interaction.editReply({ content: `Pick Order: ${captainA} > ${captainB} > ${captainC} > ${captainD}` });
    }
}