const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId, guildId } = require("../config.json");
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

        const captainA = interaction.options.getUser('captain1');
        const captainB = interaction.options.getUser('captain2');
        const captainC = interaction.options.getUser('captain3');
        const captainD = interaction.options.getUser('captain4');

        const memberA = interaction.client.guilds.cache.get(guildId).members.cache.get(captainA.id);
        const memberB = interaction.client.guilds.cache.get(guildId).members.cache.get(captainB.id);
        const memberC = interaction.client.guilds.cache.get(guildId).members.cache.get(captainC.id);
        const memberD = interaction.client.guilds.cache.get(guildId).members.cache.get(captainD.id);

        const nicknameA = memberA.nickname ?? memberA.user.globalName ?? memberA.user.username;
        const nicknameB = memberB.nickname ?? memberB.user.globalName ?? memberB.user.username;
        const nicknameC = memberC.nickname ?? memberC.user.globalName ?? memberC.user.username;
        const nicknameD = memberD.nickname ?? memberD.user.globalName ?? memberD.user.username;

        await db.set('captains', [{ nickname: nicknameA, id: captainA.id }, { nickname: nicknameB, id: captainB.id }, { nickname: nicknameC, id: captainC.id }, { nickname: nicknameD, id: captainD.id }]);

        await memberA.setNickname(`[A] ${nicknameA}`);
        await memberB.setNickname(`[B] ${nicknameB}`);
        await memberC.setNickname(`[C] ${nicknameC}`);
        await memberD.setNickname(`[D] ${nicknameD}`);

        return interaction.editReply({ content: `Pick Order: ${captainA} > ${captainB} > ${captainC} > ${captainD}` });
    }
}