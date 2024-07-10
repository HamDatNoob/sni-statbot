const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { aChannelId, bChannelId, cChannelId, dChannelId } = require("../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('makeparty')
    .setDescription('Creates a party for each team. Each team call must have exactly 5 players.'),
    async execute(interaction){
        await interaction.deferReply();

        const callA = await interaction.client.channels.cache.get(aChannelId);
        const callB = await interaction.client.channels.cache.get(bChannelId);
        const callC = await interaction.client.channels.cache.get(cChannelId);
        const callD = await interaction.client.channels.cache.get(dChannelId);

        let output = '';
        for(let call of [callA, callB, callC, callD]){
            output += `${call.name}: \`/p `;

            if(call.members.size > 5 || call.members.size < 5) return interaction.editReply({ content: `\`${call.name}\` must have exactly 5 players!` });

            for(let id of Array.from(await call.members.keys())){
                let username = await db.get(`links.${id}`);                

                if(username == undefined){
                    return interaction.editReply({ content: `\`${call.members.get(id).user.username}\` is not registered!` });
                }

                output += `${username} `;
            }

            output += `\`\n`;
        }

        interaction.editReply({ content: output });
    }
}