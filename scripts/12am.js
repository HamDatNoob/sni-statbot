const { staffChannelId, picksChannelId, guildId } = require('./../config.json');
const schedule = require('node-schedule');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fs = require('fs');
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    async execute(client){
        const rule = new schedule.RecurrenceRule(); // 7pm EDT on Saturday (11pm UTC)
        rule.dayOfWeek = 0;
        rule.hour = 0;
        rule.minute = 0;
        rule.second = 0;
        rule.tz = 'Etc/GMT+4';

        const job = schedule.scheduleJob(rule, async function(){
            // saves and deletes all messages in #picks
            let output = "";
            await client.channels.cache.get(picksChannelId).messages.fetch({ limit: 100 }).then(messages => {
                messages.forEach(msg => {
                    output += `${msg.author.username}: ${msg.content}\n\n`
                });

                client.channels.cache.get(picksChannelId).bulkDelete(messages).catch(() => {
                    messages.forEach(msg => {
                        msg.delete();
                    });
                });
            });

            // reassigns captains their original names
            const nicknames = await db.get('captains');

            await client.guilds.cache.get(guildId).members.fetch({ limit: 1000 }).then(members => {
                for(let obj of nicknames){
                    members.get(obj.id).setNickname(obj.nickname);
                }
            });

            await db.set('captains', []);
            
            const season = await db.get(`currentSeason`);
            const week = await db.get(`currentWeek`);

            // writes the file to the directory
            fs.writeFileSync(`./out/picks/s${season}w${week}.txt`, Buffer.from(output), function(){});

            const attachment = new AttachmentBuilder(`out/picks/s${season}w${week}.txt`);

            client.channels.cache.get(staffChannelId).send({ content: `Picks from season \`${season}\` week \`${week}\`:`, files: [ attachment ] });

            console.log(`Next Queue: ${job.nextInvocation().toISOString()}`);
        });

        console.log(`Next Queue: ${job.nextInvocation().toISOString()}`);
    }
}