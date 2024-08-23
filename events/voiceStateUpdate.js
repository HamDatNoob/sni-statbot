const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { orgChannelId } = require('./../config.json');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState){
		const orgCount = await db.get('orgCount');
		const orgChannel = await newState.guild.channels.cache.get(orgChannelId);
		const membersLength = Array.from(orgChannel.members.keys()).length;

		if(await db.get(`started`) == false){
			require('../scripts/lateStart.js').execute(oldState, newState);
		}else if(membersLength != orgCount){
			await db.set('orgCount', membersLength);

			if(membersLength > orgCount){
				require('../scripts/lateJoin.js').execute(oldState, newState);
			}
		}
	},
}; 