const package = require("../package.json");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

async function listParticipation(page, stats, interaction){
    let set = stats.slice(page * 10, Math.min(page * 10 + 10, stats.length));

    const rows = [];
    const embedFields = [];
    for(let i in set){
        let pos = stats.indexOf(set[i]) + 1;

        let participation = set[i].participated;

        embedFields.push({
            name: `${pos}: ${set[i].username} - \`${participation}\``, 
            value: `Games: \`${set[i].games}\`, Game Wins: \`${set[i].gameWins}\``
        });
    }

    const embed = [
        new EmbedBuilder()
            .setTitle(`Participation Leaderboard: Page ${page + 1}`)
            .setColor('#FEF853')
            .setFooter({ text: `sni-statbot v${package.version}, by @ha_m                                                          ‎`, iconURL: 'https://media.discordapp.net/attachments/874081782792859740/1251666124865540137/image.png?ex=66808beb&is=667f3a6b&hm=9d97963725732c8f2db12c1cfc3a0addd93f39be60a2593c40cefda9d51b8b5d&' }) // extra space so buttons dont look dumb
            .addFields(embedFields)
    ];

    let disabledButtons = [false, false, false];
    if(page == 0) disabledButtons[0] = true;
    if(stats.length <= 10) disabledButtons[1] = true;
    if(page == Math.ceil(stats.length / 10) - 1) disabledButtons[2] = true;

    const navButtons = [
        new ButtonBuilder()
            .setEmoji('⏮️')
            .setCustomId('participation_first')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabledButtons[0]),

        new ButtonBuilder()
            .setEmoji('◀️')
            .setCustomId('participation_back')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabledButtons[0]),

        new ButtonBuilder()
            .setEmoji('#️⃣')
            .setCustomId('participation_search')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabledButtons[1]),

        new ButtonBuilder()
            .setEmoji('▶️')
            .setCustomId('participation_next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabledButtons[2]),

        new ButtonBuilder()
            .setEmoji('⏭️')
            .setCustomId('participation_last')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabledButtons[2]),
    ];

    rows.push(
        new ActionRowBuilder()
            .addComponents(navButtons)
    );
        
    if(interaction.replied) {
        return interaction.update({ embeds: embed, components: rows });
    }else{
        return interaction.editReply({ embeds: embed, components: rows });
    }
}

module.exports = { listParticipation };