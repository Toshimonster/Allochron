const Allochron = require('../../../');
const discord = require('discord.js');

const DiscordClient = class extends Allochron.Pool.Client {
	constructor(DiscordClient, Pool, Module) {
		super(Pool, Module);
		this.Client = DiscordClient;
	}

	addCommand(command, callback, options = {}) {
		this.Pool.commands.push({
			cmd: command,
			callback: callback,
			options: options,
		});
	}
};
const Discord = new Allochron.Pool.Pool(
	'DiscordCommander',
	function () {
		this.debug('Initializing');
		this.Client = new discord.Client();

		this.commands = [];

		this.Client.on('message', (msg) => {
			if (msg.content.startsWith(process.env.DISCORD_PREFIX)) {
				this.commands.forEach((cmd) => {
					if (
						msg.content
							.slice(process.env.DISCORD_PREFIX.length)
							.toLowerCase()
							.startsWith(cmd.cmd)
					)
						cmd.callback(msg);
				});
			}
		});

		this.Client.login(process.env.DISCORD_TOKEN || 'undefined');
	},
	function (Chron, Module) {
		let client = new DiscordClient(this.Client, this, Module);
		return client;
	}
);

module.exports = Discord;
