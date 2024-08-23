const { orgChannelId, picksChannelId } = require('../config.json');
const schedule = require('node-schedule');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    async execute(oldState, newState){
        const fullMembers = await newState.guild.channels.cache.get(orgChannelId).members;
        const members = Array.from(await newState.guild.channels.cache.get(orgChannelId).members.keys());
        const num = members.length;
        
        const time = new Date();

        if(num >= 20 && time.getDay() == db.get('startDay') && time.getHours() == db.get('startHour')){ // if org is at 20 players, on saturday, between 7:00-7:59pm, and picks haven't started yet
            await db.set(`started`, true);

            let output = `# PICKS HAVE BEGUN! (${num - 20} will not play)\nCaptains will be determined shortly, use /captains when they have been selected\nUsernames:\n\`\`\`\n`;

            for(let id of members){
                let usernameNoCaps = await db.get(`links.${id}`);
                let usernameCaps = await db.get(`stats.${usernameNoCaps}.username`);
                
                if(usernameCaps == undefined){
                    usernameCaps = `Unregistered Player (${fullMembers.get(id).user.username})`
                }

                output += `${usernameCaps}\n`;
            }

            output += `\`\`\``;

            newState.guild.channels.cache.get(picksChannelId).send(output);
        }
    }
}