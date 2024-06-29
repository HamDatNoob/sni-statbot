const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('r')
    .setDescription('Check a player\'s stats')
    .addStringOption(option => option
        .setName('username')
        .setDescription('The username to check stats of')
        .setRequired(false)
    ),
    async execute(interaction){
        let username = interaction.options.getString("username").toLowerCase();
        
        if(username == undefined){
            username = await db.get(`links.${interaction.user.id}`);
            if(username == undefined) return interaction.reply({ content: 'You haven\'t linked a Minecraft Account! Do \`/register\` to link one!', ephemeral: true });
        }

        if(await db.get(`stats.${username}`) == undefined) return interaction.reply({ content: `\`${username}\` hasn\'t been registered yet! Do \`/register\` to link it!`, ephemeral: true });

        const usernameCaps = await db.get(`stats.${username}.username`);
        const weekWins = parseInt(await db.get(`stats.${username}.weekWins`));
        const kills = parseInt(await db.get(`stats.${username}.kills`));
        const deaths = parseInt(await db.get(`stats.${username}.deaths`));
        const wins = parseInt(await db.get(`stats.${username}.gameWins`));
        const games = parseInt(await db.get(`stats.${username}.games`));
        const rounds = parseInt(await db.get(`stats.${username}.rounds`));
        const participated = parseInt(await db.get(`stats.${username}.participated`));
        const currentWeek = parseInt(await db.get(`currentWeek`));

        let kdr = kills / deaths;
        let wlr = wins / games;
        let kpr = kills / rounds;

        if(isNaN(kdr) || kdr == 0){
            kdr = "0.000";
        }else{
            kdr = Number(kdr).toFixed(3);
        }

        if(isNaN(wlr) || wlr == 0){
            wlr = "0.00";
        }else{
            wlr *= 100;

            wlr = Number(wlr).toFixed(Math.abs(2 - Math.floor(Math.log10(wlr))));
        }

        if(isNaN(kpr) || kpr == 0){
            kpr = "0.000";
        }else{
            kpr = Number(kpr).toFixed(3);
        }

        const output = `\`${usernameCaps}\` has \`${weekWins}\` week wins, a KDR of \`${kdr}\`, a game W/L of \`${wins}/${games - wins} (${wlr}%)\`,\na KPR of \`${kpr}\`, and has participated in \`${participated} out of ${currentWeek}\` weeks.`

        return interaction.reply({ content: output });
    }
}