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

        if(num == 20 && time.getDay() == 2 && time.getHours() == 19 && await db.get(`started`) == false){ // if org is at 20 players, on saturday, between 7:00-7:59pm, and picks haven't started yet
            let output = `# PICKS HAVE BEGUN!\nUsernames:\n\`\`\`\n`;

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