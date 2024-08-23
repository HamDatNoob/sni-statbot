const { QuickDB } = require("quick.db");
const { staffId } = require("../config.json");
const db = new QuickDB();
const package = require("../package.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('maps')
    .setDescription('Set the available maps for the week'),
    async execute(interaction){
        const mapWeeks = await db.get(`maps.weeks`);
        const mapOptions = await db.get(`maps.options`);
        const currentWeek = await db.get(`currentWeek`);

        const [map1, map2, map3, map4, map5] = mapWeeks[currentWeek];

        let fieldValue = `\`\`\`\n╔══════════════╤═══════════════╤══════════════╗\n║   MAP NAME   │ TIMES IN POOL │ TIMES PLAYED ║\n╟──────────────┼───────────────┼──────────────╢\n`;

        for(let map in mapOptions){
            let inPool = String(mapOptions[map].inPool);
            let picked = String(mapOptions[map].picked);

            if(inPool == 0) continue;

            fieldValue += `║ ${map + " ".repeat(12 - map.length)} │ ${inPool + " ".repeat(13 - inPool.length)} │ ${picked + " ".repeat(12 - picked.length)} ║\n`;
        }

        fieldValue += `╚══════════════╧═══════════════╧══════════════╝\n\`\`\``;

        const embed = [
            new EmbedBuilder()
                .setTitle(`Maps`)
                .setDescription(`This week's map pool is:\n\`${map1}, ${map2}, ${map3}, ${map4}, ${map5}\``)
                .setColor('#FEF853')
                .setFooter({ text: `sni-statbot v${package.version}, by @ha_m                                                          ‎`, iconURL: 'https://media.discordapp.net/attachments/874081782792859740/1251666124865540137/image.png?ex=66808beb&is=667f3a6b&hm=9d97963725732c8f2db12c1cfc3a0addd93f39be60a2593c40cefda9d51b8b5d&' }) // extra space so buttons dont look dumb
                .addFields({ name: `‎`, value: fieldValue })
        ];

        return interaction.reply({ embeds: embed });
    }
}

// ╔═════════════════════════════════════════════╗
// ║                    MAPS                     ║
// ╠══════════════╤═══════════════╤══════════════╣
// ║   MAP NAME   │ TIMES IN POOL │ TIMES PLAYED ║
// ╟──────────────┼───────────────┼──────────────╢
// ║ Alleyway     │ X             │ Y            ║
// ║ Atomic       │ X             │ Y            ║
// ║ Bazaar       │ X             │ Y            ║
// ║ Carrier      │ X             │ Y            ║
// ║ Derailed     │ X             │ Y            ║
// ║ Junction     │ X             │ Y            ║
// ║ Overgrown    │ X             │ Y            ║
// ║ Reserve      │ X             │ Y            ║
// ║ Ruins        │ X             │ Y            ║
// ║ Sandstorm    │ X             │ Y            ║
// ╚══════════════╧═══════════════╧══════════════╝