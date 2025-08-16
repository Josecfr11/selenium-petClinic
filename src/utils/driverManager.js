const { Builder } = require('selenium-webdriver');

async function getDriver() {
    // El 'selenium-manager' se encargará de encontrar y descargar el driver de Edge
    console.log("Iniciando el WebDriver de Edge (gestión automática)...");
    const driver = await new Builder().forBrowser('MicrosoftEdge').build();
    return driver;
}
// Esta función cierra el WebDriver
async function quitDriver(driver) {
    if (driver) {
        console.log("Cerrando el navegador...");
        await driver.quit();
    }
}

module.exports = { getDriver, quitDriver };