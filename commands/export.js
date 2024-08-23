const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { hamId, statsChannelId } = require("../config.json");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('export')
    .setDescription('Exports the current database'),
    async execute(interaction){
        if(!interaction.user.id == hamId) return interaction.reply({ content: "You cannot use this command!", ephemeral: true });

        await interaction.deferReply();

        const season = await db.get('currentSeason');

        const dbAttachment = new AttachmentBuilder('json.sqlite');

        let output = "";
        await interaction.client.channels.cache.get(statsChannelId).messages.fetch({ limit: 100 }).then(messages => {
            messages.reverse().forEach(msg => {
                output += `${msg.author.username}: ${msg.content}\n\n`
            });
        });

        fs.writeFileSync(`./out/stats/season${season}.txt`, Buffer.from(output), function(){});

        const messagesAttachment = new AttachmentBuilder(`out/stats/season${season}.txt`);

        return interaction.editReply({ content: `Database from season \`${season}\`:`, files: [ dbAttachment, messagesAttachment ] });
    }
}