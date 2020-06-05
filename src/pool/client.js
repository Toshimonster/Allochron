const Logger = require('../util').Logger;

class Client extends Logger {
	constructor(Pool, Module) {
		super('Client');
		this.Pool = Pool;
		this.prefix = `${Pool.name}:${Module.name}`;
	}
}

module.exports = Client;
