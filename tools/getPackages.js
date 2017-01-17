const fs = require('fs-extra');
const _ = require('lodash');

function getPackages() {
    const packageJson = require(`${process.cwd()}/package.json`);

    const packagesMap = {
        map: {},
        packages: {},
    };

    packagesMap.map[packageJson.name] = 'src';
    packagesMap.packages[packageJson.name] = {"main": packageJson.main || 'index.js'};

    function add(dependencies) {
        if (!dependencies) {
            return;
        }

        const mappedPackages = _.keys(packagesMap.map);

        _(dependencies).omit(mappedPackages).forEach((dependencyVersion, dependencyName) => {
            fs.copySync(`node_modules/${dependencyName}`, `browser_modules/${dependencyName}`);
            const dependencyPackageData = require(`${dependencyName}/package.json`);

            packagesMap.map[dependencyPackageData.name] = `browser_modules/${dependencyPackageData.name}`;
            packagesMap.packages[dependencyPackageData.name] = {
                main: `${dependencyPackageData.main || 'index.js'}`,
            };

            add(dependencyPackageData.browserDependencies || dependencyPackageData.dependencies);
        });
    }

    add(packageJson.browserDependencies || packageJson.dependencies);

    return Promise.resolve(packagesMap);
}

module.exports = getPackages;