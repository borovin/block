(function () {

    var imports = window.__testFiles__.map(function (testFile) {
        return System.import(testFile.replace('.js', ''));
    });

    Promise.all(imports).then(function () {
        window.startJasmine();
    });

})();

