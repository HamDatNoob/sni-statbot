const fs = require('fs');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction){
		if(interaction.isCommand()){ //commands
			let command = interaction.client.commands.get(interaction.commandName);

			if(!command) return;

			if(interaction.options.getSubcommand(false)){
				try{
					const subcommand = interaction.options.getSubcommand(); 
					
					await require(`../commands/subcommands/${interaction.commandName}/${subcommand}`).execute(interaction);
				}catch(error){
					console.error(error);

					if(interaction.replied || interaction.deferred) {
						return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					}else{
						return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}else{
				try{
					await command.execute(interaction);
				}catch(error){
					console.error(error);

					if(interaction.replied || interaction.deferred) {
						return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					}else{
						return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}
		}else if(interaction.isStringSelectMenu()){ //select menus
			const selectMenuFiles = fs.readdirSync('./components/selectMenus').filter(file => file.endsWith('.js'));
			for(const file of selectMenuFiles){
				const component = require(`../components/selectMenus/${file}`);

				if(component.name != interaction.customId) continue;
				
				try{
					await component.execute(interaction);
				}catch(error){
					console.error(error);

					if(interaction.replied || interaction.deferred) {
						return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					}else{
						return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}
		}else if(interaction.isButton()){ //buttons
			const buttonFiles = fs.readdirSync('./components/buttons').filter(file => file.endsWith('.js'));
			for(const file of buttonFiles){
				const component = require(`../components/buttons/${file}`);
				
				if(component.name != interaction.customId) continue;
				
				try{
					await component.execute(interaction);
				}catch(error){
					console.error(error);

					if(interaction.replied || interaction.deferred) {
						return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
					}else{
						return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
			}
		}else if(interaction.isAutocomplete()){ //autocompletes
			const autocompleteFiles = fs.readdirSync('./components/autocompletes').filter(file => file.endsWith('.js'));
			for(const file of autocompleteFiles){
				const component = require(`../components/autocompletes/${file}`);

				if(component.name != interaction.commandName.concat('_autocomplete')) continue;

				try{
					await component.execute(interaction);
				}catch(error){
					console.error(error);
					return;
				}
			}
		}else if(interaction.isModalSubmit()){
			try{
				const customId = interaction.customId; 
				
				await require(`../components/modals/${customId}`).execute(interaction);
			}catch(error){
				console.error(error);

				if(interaction.replied || interaction.deferred) {
					return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				}else{
					return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}else{ //nothing found
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}; 