const Util = require('../util');
const fs = require('fs');
const path = require('path');

/**
 * Represents the main manager for Pools and Modules
 *
 * @param {string} name The Name
 * @param {number} logLevel The log Level
 * @class Chron
 * @extends {Util.Logger}
 */
class Chron extends Util.Logger {
	#Pools = {};
	#PoolStack = [];
	#Modules = {};
	#ModuleStack = [];

	constructor(name = 'Chron', logLevel = 0) {
		super(name, logLevel);
	}

	/**
	 * Set the clients for the module
	 *
	 * @param {Module} Module
	 * @memberof Chron
	 */
	async getClients(Module) {
		Module.debug('Getting Clients');
		Module.requiredPools.forEach(async (poolName) => {
			Module.trace(`Trying to get client from pool ${poolName}`);
			if (this.#Pools[poolName]) {
				let client = await this.#Pools[poolName].spawnClient(this, Module);

				Module.addRuntimeClient(client);
			} else {
				Module.warn(
					`Pool ${poolName} does not exist in chron, but is requested in the module`
				);
			}
		});
	}

	async _initializePools() {
		for (let name of this.#PoolStack) {
			this.debug('Initializing Pool', name.name);
			await this.#Pools[name.name].initialize();
		}
	}

	async _initializeModules() {
		for (let name of this.#ModuleStack) {
			this.debug('Initializing Module', name.name);
			await this.#Modules[name.name].initialize(this);
		}
	}

	async _executeRuntime() {
		for (let name of this.#ModuleStack) {
			this.debug('Executing Runtime', name.name);
			await this.#Modules[name.name].executeRuntime();
		}
	}

	async _fetchModuleClients() {
		let promises = [];
		this.#ModuleStack.forEach((module) => {
			promises.push(this.getClients(module));
		});
		return await Promise.all(promises);
	}

	/**
	 * Adds the Pool to the Chron, so that it can be accessed by a Module
	 *
	 * @param {Logger} Pool The Pool
	 * @returns {Logger} The Pool
	 * @memberof Chron
	 */
	addPool(Pool) {
		this.info('Adding Pool', Pool.name);
		this.#PoolStack.push(Pool);
		return (this.#Pools[Pool.name] = Pool);
	}

	/**
	 * Adds all .js files to the chron inside of a directory
	 * Files should export the Pool
	 *
	 * @param {string} Dir
	 * @memberof Chron
	 */
	addPools(Dir = './Pools') {
		this.info('Adding Pools from ', Dir);
		if (fs.existsSync(Dir)) {
			fs.readdirSync(Dir).forEach((file) => {
				if (path.extname(file)) {
					this.trace(`Found file ${file}`);
					let Pool = require(path.join(Dir, file));
					this.addPool(Pool);
				}
			});
		} else {
			this.error(`Cannot find directory ${Dir} when adding Pools`);
		}
	}

	/**
	 * Adds the Module to the Chron, to be initialized in the order of addition
	 *
	 * @param {Logger} Module The Module
	 * @returns {Logger} The Module
	 * @memberof Chron
	 */
	addModule(Module) {
		this.info('Adding Module', Module.name);
		this.#ModuleStack.push(Module);
		return (this.#Modules[Module.name] = Module);
	}

	/**
	 * Adds all .js files to the chron inside of a directory
	 * Files should export the Module
	 *
	 * @param {string} Dir
	 * @memberof Chron
	 */
	addModules(Dir = './Modules') {
		this.info('Adding Modules from ', Dir);
		if (fs.existsSync(Dir)) {
			fs.readdirSync(Dir).forEach((file) => {
				if (path.extname(file)) {
					this.trace(`Found file ${file}`);
					let Module = require(path.join(Dir, file));
					this.addPool(Module);
				}
			});
		} else {
			this.error(`Cannot find directory ${Dir} when adding Modules`);
		}
	}

	async start() {
		this.info('Starting Chron');
		this.debug('Initializing Pools');
		await this._initializePools();
		this.debug('Initializing Modules');
		await this._initializeModules();

		await this._fetchModuleClients();

		await this._executeRuntime();
	}
}

module.exports = Chron;
