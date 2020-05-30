const Allochron = require('../../../');

module.exports = new Allochron.Module(
	'Example',
	['Example', 'meow'],
	function () {
		this.debug('Initializing!');
	},
	function (runtime) {
		this.debug(runtime.Example.meow());
	}
);
