const Selector = require('../utils/selector');

fixture `Button tests`
    .page `http://localhost:5001/examples/button.html`;

test('Default button', async t => {
    const button = Selector('b-button');
    const outerHTML = await button.outerHTML;

    await t.expect(outerHTML).eql('<b-button color="primary">\n        <button>\n            Default button\n        </button>\n    </b-button>');
});