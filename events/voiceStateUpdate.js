module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState) {
		require('../scripts/lateStart.js').execute(oldState, newState);
	},
}; 