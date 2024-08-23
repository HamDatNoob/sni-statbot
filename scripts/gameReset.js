const { staffChannelId, picksChannelId, guildId, captainId } = require('../config.json');
const schedule = require('node-schedule');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fs = require('fs');
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    async execute(client){
        const rule = new schedule.RecurrenceRule(); // 12am EDT on Sunday (4am UTC)
        rule.dayOfWeek = await db.get(`startDay`);
        rule.hour = 23;
        rule.minute = 59;
        rule.second = 59;
        rule.tz = 'Etc/GMT+4';

        const job = schedule.scheduleJob(rule, async function(){
            if(await db.get(`started`) == false) return;

            // saves and deletes all messages in #picks
            let output = "";
            await client.channels.cache.get(picksChannelId).messages.fetch({ limit: 100 }).then(messages => {
                console.log(messages)
                messages.reverse().forEach(msg => {
                    output += `${msg.author.username}: ${msg.content}\n\n`;
                });

                client.channels.cache.get(picksChannelId).bulkDelete(messages).catch(() => {
                    messages.forEach(msg => {
                        msg.delete();
                    });
                });
            });

            // reassigns captains their original names
            try{
                const nicknames = await db.get('captains');
                const captain = await interaction.guild.roles.cache.get(captainId);

                await client.guilds.cache.get(guildId).members.fetch({ limit: 1000 }).then(members => {
                    for(let obj of nicknames){
                        members.get(obj.id).setNickname(obj.nickname);
                        members.get(obj.id).roles.remove(captain);
                    }
                });
    
                await db.set('captains', []);
                await db.set('started', false);
            }catch(err){
                console.error(err);
            }

            const season = await db.get(`currentSeason`);
            const week = await db.get(`currentWeek`);

            // writes the file to the directory
            fs.writeFileSync(`./out/picks/s${season}w${week}_picks.txt`, Buffer.from(output), function(){});

            const attachment = new AttachmentBuilder(`out/picks/s${season}w${week}_picks.txt`);

            client.channels.cache.get(staffChannelId).send({ content: `Picks from season \`${season}\` week \`${week}\`:`, files: [ attachment ] });

            console.log(`Next Reset: ${job.nextInvocation().toISOString()}`);
        });

        console.log(`Next Reset: ${job.nextInvocation().toISOString()}`);
    }
}