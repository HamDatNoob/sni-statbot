module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		require('../scripts/gameStart.js').execute(client); // starts the start task
		require('../scripts/gameReset.js').execute(client); // starts the reset task

		console.log('Started the start and reset message tasks');
	},
}; 
