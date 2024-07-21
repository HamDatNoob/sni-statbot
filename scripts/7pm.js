const { orgChannelId, picksChannelId } = require('./../config.json');
const schedule = require('node-schedule');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    async execute(client){
        const rule = new schedule.RecurrenceRule(); // 7pm EDT on Saturday (11pm UTC)
        rule.dayOfWeek = 6;
        rule.hour = 19;
        rule.minute = 0;
        rule.second = 0;
        rule.tz = 'Etc/GMT+4';

        const job = schedule.scheduleJob(rule, async function(){
            const fullMembers = await client.channels.cache.get(orgChannelId).members;
            const members = Array.from(fullMembers.keys());
            const num = members.length;

            if(num >= 20){
                await db.set(`started`, true);

                let output = `# PICKS HAVE BEGUN! (${num - 20} will not play)\nCaptains will be determined shortly, use /captains when they have been selected\nUsernames:\n\`\`\`\n`;

                for(let id of members){
                    let usernameNoCaps = await db.get(`links.${id}`);
                    let usernameCaps = await db.get(`stats.${usernameNoCaps}.username`);
                    
                    if(usernameCaps == undefined){
                        usernameCaps = `Unregistered Player (${fullMembers.get(id).user.username})`;
                    }
    
                    output += `${usernameCaps}\n`;
                }

                output += `\`\`\``;

                client.channels.cache.get(picksChannelId).send(output);
            }else{ // <20 (not enough to play)
                client.channels.cache.get(picksChannelId).send('# NOT ENOUGH PLAYERS TO START!\nPicks will start if/when the call reaches 20 players.');
            }

            console.log(`Next Queue: ${job.nextInvocation().toISOString()}`);
        });

        console.log(`Next Queue: ${job.nextInvocation().toISOString()}`);
    }
}