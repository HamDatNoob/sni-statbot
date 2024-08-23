const { orgChannelId, picksChannelId } = require('../config.json');
const schedule = require('node-schedule');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    async execute(oldState, newState){
        const fullMembers = await newState.guild.channels.cache.get(orgChannelId).members;
        
        newState.client.channels.cache.get(picksChannelId).messages.fetch(await db.get(`playersMessage`)).then(async message => {
            if(message != undefined){
                let content = message.content.slice(0, message.content.lastIndexOf('```'));
                
                let usernameNoCaps = await db.get(`links.${newState.id}`);
                let usernameCaps = await db.get(`stats.${usernameNoCaps}.username`);
                
                if(usernameCaps == undefined){
                    usernameCaps = `Unregistered Player (${fullMembers.get(newState.id).user.username})`;
                }

                if(content.includes(usernameCaps)) return;

                content += `${usernameCaps}\n\`\`\``;

                message.edit(content);
            }else{
                console.log(`message not found (id: ${await db.get(`playersMessage`)})`)
            }
        });
    }
}