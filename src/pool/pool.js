const Logger = require('../util').Logger;

/**
 * A class representing a Client Pool
 *
 * @class Pool
 * @extends {Logger}
 */
class Pool extends Logger {

	/**
     *Creates an instance of Pool.
     * @param {string} poolName
     * @param {initialize} [initialize=(Chron)=>{}]
     * @param {spawnClient} [spawnClient=(Module)=>{}]
     * @memberof Pool
     */
	constructor(poolName, initialize=()=>{}, spawnClient=()=>{}) {
		super(poolName);
		this.prefix = 'Pool';
		this._initialize = initialize.bind(this);
		this._spawnClient = spawnClient.bind(this);
		this.trace('Pool made');
	}

	/**
     * The function to be run on initialization
     * @callback initialize
     * @returns {void | Promise<void>}
     */

	/**
     * The function to be run on initialization
     */
	async initialize () {
		return await this._initialize();
	}

	/**
     * The function to spawn a client for the module
     * @callback spawnClient
     * @param {Chron} Chron The Chron that is asking for the spawn
     * @param {Module} Module The Module that is asking for the spawn
     * @returns {Client} The Client
     */

	/**
     * The function to spawn a client for the module
     * @param {Chron} Chron 
     * @param {Module} Module 
     */
	async spawnClient (Chron, Module) {
		this.debug(`Spawning client for module ${Module.name}`);
		let client = await this._spawnClient(Chron, Module);
		return client;
	}
}

module.exports = Pool;