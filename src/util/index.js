const chalk = require('chalk');
const moment = require('moment');
const util = require('util');

/**
 * A class providing support for logging
 * @param {string} name The name to log with.
 * @param {number} logLevel All logs below this level will not be logged
 * @abstract
 * @class Logger
 */
class Logger {
	#logLevels = {
		trace: 'lightgrey',
		debug: 'cyan',
		info: 'white',
		warn: 'yellow',
		error: 'red',
	};

	#logLevel = 0;
	#name = null;
	#prefix = undefined;

	/**
	 * The prefix of the logger
	 *
	 * @memberof Logger
	 */
	set prefix(value) {
		this.#prefix = value;
	}

	/**
	 * The name of the Logger
	 *
	 * @readonly
	 * @memberof Logger
	 */
	get name() {
		return this.#name;
	}

	constructor(name = undefined, logLevel = 0) {
		this.#name = name;
	}

	_getprefix() {
		return `[${moment().format('DD/MM/YY HH:mm:ss:SS')} ${
			this.#prefix ? this.#prefix + ':' : ''
		}${this.#name}]`;
	}

	_log(level, messages) {
		let message = [];
		messages.forEach((obj) => {
			if (typeof obj === 'string') {
				message.push(obj);
			} else {
				message.push(util.inspect(obj, false, null, true));
			}
		});
		if (this.#logLevel > level) return;
		return console.log(
			chalk.keyword(Object.values(this.#logLevels)[level])(
				chalk.bold(this._getprefix()),
				message.join(' ')
			)
		);
	}

	/**
	 * Logs with the level of 'trace'
	 * @param  {...string} message Content to be logged
	 */
	trace(...message) {
		return this._log(0, message);
	}
	/**
	 * Logs with the level of 'debug'
	 * @param  {...string} message Content to be logged
	 */
	debug(...message) {
		return this._log(1, message);
	}
	/**
	 * Logs with the level of 'info'
	 * @param  {...string} message Content to be logged
	 */
	info(...message) {
		return this._log(2, message);
	}
	/**
	 * Logs with the level of 'warn'
	 * @param  {...string} message Content to be logged
	 */
	warn(...message) {
		return this._log(3, message);
	}
	/**
	 * Logs with the level of 'error'
	 * @param  {...string} message Content to be logged
	 */
	error(...message) {
		return this._log(4, message);
	}
}

module.exports = {
	Logger: Logger,
};
