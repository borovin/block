const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

function getPackages() {
    const packageJson = require(`${process.cwd()}/package.json`);

    const packagesMap = {
        map: {},
        packages: {},
    };

    packagesMap.map[packageJson.name] = '.';
    packagesMap.packages[packageJson.name] = {"main": packageJson.main || 'index.js'};

    function add(dependencies) {
        if (!dependencies) {
            return;
        }

        const mappedPackages = _.keys(packagesMap.map);

        _(dependencies).omit(mappedPackages).forEach((dependencyVersion, dependencyName) => {
            const dependencyPackageJson = path.resolve(`node_modules/${dependencyName}/package.json`);
            const dependencyPackageData = fs.readJsonSync(dependencyPackageJson);

            packagesMap.map[dependencyPackageData.name] = `node_modules/${dependencyPackageData.name}`;
            packagesMap.packages[dependencyPackageData.name] = {
                main: `${dependencyPackageData.main || 'index.js'}`,
            };

            add(dependencyPackageData.dependencies);
        });
    }

    add(packageJson.dependencies);

    return Promise.resolve(packagesMap);
}

module.exports = getPackages;