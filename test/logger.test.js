const Logger = require("../src/util").Logger

const test = new Logger("testLogger1")
const test2 = new Logger("testLogger2")

test.trace("trace")
test.debug("debug")
test.info("info")
test.warn("warn")
test.error("error")