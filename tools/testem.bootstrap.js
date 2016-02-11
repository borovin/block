(function () {

    var imports = __testFiles__.map(function (testFile) {
        return System.import(testFile.replace('.js', ''));
    });

    Promise.all(imports).then(function () {
        window.startJasmine();
    });

})();

