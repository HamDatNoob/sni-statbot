const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { hamId } = require("../config.json");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboards for various stats')
    .addSubcommand(subcommand => subcommand
        .setName('kdr')
        .setDescription("Leaderboard for KDR")
    )
    .addSubcommand(subcommand => subcommand
        .setName('kpr')
        .setDescription("Leaderboard for KPR")
    )
    .addSubcommand(subcommand => subcommand
        .setName('participation')
        .setDescription("Leaderboard for participation")
    )
    .addSubcommand(subcommand => subcommand
        .setName('wins')
        .setDescription("Leaderboard for wins")
    )
}

// dummy command for subcommands, see ./subcommands/leaderboard/...