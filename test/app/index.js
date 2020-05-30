const Allochron = require('../../');
const path = require('path');

const Chron = new Allochron.Chron();

Chron.addPools(path.join(__dirname, 'Pools'));
Chron.addModules(path.join(__dirname, 'Modules'));

Chron.start();
