const {Selector, t} = require('testcafe');
const fs = require('fs');
const sharp = require('sharp');
const getUserAgent = require('./getUserAgent');

async function getScreenshot(selector, title) {
    const screenshotPath = await t.resizeWindow(800, 600).takeScreenshot();
    const rect = await Selector(selector).boundingClientRect;
    const screenshotData = fs.readFileSync(screenshotPath);
    console.log(t);
    await sharp(screenshotData)
        .resize(800, 600)
        .crop('southwest')
        .extract({
            left: Math.ceil(rect.left),
            top: Math.ceil(rect.top),
            width: Math.ceil(rect.width),
            height: Math.ceil(rect.height)
        })
        .toFile('./tests/screenshots/test.png');

    return screenshotData;
}

module.exports = getScreenshot;