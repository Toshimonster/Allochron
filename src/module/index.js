const Logger = require('../util').Logger;

class runtimeObject {
	constructor(runtimeClients) {
		Object.assign(this, runtimeClients);
	}
}

/**
 * A class representing a module
 * @class Module
 * @extends {Logger}
 */
class Module extends Logger {

    #runtimeClients = {};

    addRuntimeClient (Client) {
    	this.#runtimeClients[Client.pool.name] = Client;
    	this.debug(`Added ${Client.name} to runtime`);
    }

    async executeRuntime () {
    	this.debug('Executing runtime');
    	let runtime = new runtimeObject(this.#runtimeClients);
    	return await this.runtime(runtime);
    }

    /**
     *Creates an instance of Module.
     * @param {string} moduleName
     * @param {array<string>} [requiredPools=[]]
     * @param {initialize} [initialize=(Module)=>{}]
     * @param {runtimeObject} [runtime=(runtimeObject, Module)=>{}]
     * @memberof Module
     */
    constructor (moduleName, requiredPools=[], initialize=(Module)=>{}, runtime=(runtimeObject, Module)=>{}) {
    	super(moduleName);
    	this.prefix = 'Module';
    	this.requiredPools = requiredPools;
    	this._initialize = initialize;
    	this._runtime = runtime;
    }

    /**
     * @callback initialize
     * @param {Module} Module This Module
     * @returns {void | Promise<void>}
     */

    /**
     * The function to be run on initialization
     * @type {initialize}
     * @memberof Pool
     */
    async initialize () {
    	return await this._initialize(this);
    }

    /**
     * @callback runtime
     * @param {runtimeObject} runtimeObject
     * @param {Module} Module
     * @returns {void}
     */

    /**
     * The function to be run on runtime
     * @type {runtime}
     * @memberof Module
     */
    async runtime (runtime) {
    	return await this._runtime(runtime, this);
    }
}

module.exports = Module;