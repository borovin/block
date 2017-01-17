const fs = require('fs-extra');
const packageJson = require('../package.json');

fs.ensureSymlinkSync('.', `node_modules/${packageJson.name}`);