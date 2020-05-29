const Allochron = require("../src");

const Chron = new Allochron.Chron();

const ExampleClient = class extends Allochron.Pool.Client {
	meow() {
		this.debug("MEEEEOW");
		return "meow";
	}
};
const ExamplePool = new Allochron.Pool.Pool(
	"Example",
	function (Pool) {
		this.debug("Initializing");
	},
	function (Chron, Module) {
		let client = new ExampleClient(this, Module);
		return client;
	}
);

const ExampleModule = new Allochron.Module(
    "Example", 
    ["Example", "meow"],
    function (Module) {
        this.debug("Initializing!")
    },
    function (runtime, Module) {
        this.debug(runtime.Example.meow());
    }
)

Chron.addPool(ExamplePool);
Chron.addModule(ExampleModule);
Chron.start();