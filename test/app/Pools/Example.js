const Allochron = require('../../../');

const ExampleClient = class extends Allochron.Pool.Client {
	meow() {
		this.debug('MEEEEOW');
		return 'meow';
	}
};
const ExamplePool = new Allochron.Pool.Pool(
	'Example',
	function () {
		this.debug('Initializing');
	},
	function (Chron, Module) {
		let client = new ExampleClient(this, Module);
		return client;
	}
);

module.exports = ExamplePool;
