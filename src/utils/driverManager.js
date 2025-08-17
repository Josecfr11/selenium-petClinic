const { Builder } = require('selenium-webdriver');

async function getDriver() {
    const driver = await new Builder().forBrowser('MicrosoftEdge').build();
    return driver;
}
async function quitDriver(driver) {
    if (driver) {
        await driver.quit();
    }
}

module.exports = { getDriver, quitDriver };