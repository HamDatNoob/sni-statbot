const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { staffId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setstarttime')
    .setDescription('Set the time to start the game')
    .addIntegerOption(option => option
        .setName('day')
        .setDescription('day of week, 0-6 (sun 0, sat 6)')
        .setRequired(false)
    )
    .addIntegerOption(option => option
        .setName('hour')
        .setDescription('24 hour time')
        .setRequired(false)
    ),
    async execute(interaction){
        if(!interaction.member.roles.cache.has(staffId)) return interaction.reply({ content: "You must be Staff to use this command!", ephemeral: true });

        const day = interaction.options.getInteger("day") ?? await db.get('startDay');
        const hour = interaction.options.getInteger("hour") ?? await db.get('startHour');

        await db.set(`startDay`, day);
        await db.set('startHour', hour);

        interaction.reply({ content: `Current start time is now \`Day: ${day}, Hour: ${hour}\`` });
    }
}