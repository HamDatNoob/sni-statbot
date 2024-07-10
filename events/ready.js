module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		require('../scripts/7pm.js').execute(client); // starts the 7pm task
		require('../scripts/12am.js').execute(client); // starts the 12am task

		console.log('Started the 7pm and 12am message tasks');
	},
}; 