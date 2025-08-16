const { getDriver, quitDriver } = require('../utils/driverManager');
const { By, Key } = require('selenium-webdriver');
const assert = require('assert');

const BASE_URL = 'http://localhost:4200/petclinic/welcome';

describe('Pruebas en funcionales para busqueda de Dueños', function () {
    let driver;
    beforeEach(async function () {
        driver = await getDriver();
    });

    afterEach(async function () {
        await quitDriver(driver);
    });

    it('Debe encontrar a un dueño por apellido', async function () {
        await driver.get(BASE_URL);
        const searchNavItemOwners = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]'));
        await searchNavItemOwners.click();
        const searchNavItemOwnersSearch = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]/ul/li[1]/a'));
        await searchNavItemOwnersSearch.click();
        const searchInputOweners = await driver.findElement(By.xpath('//*[@id="lastName"]'));
        const desiredValueForSearch = 'Flores';
        await searchInputOweners.sendKeys(desiredValueForSearch, Key.RETURN);
        const patronRegExp = new RegExp(desiredValueForSearch);
        const tableValueOfSearch = await driver.findElement(By.xpath('//*[@id="ownersTable"]/table/tbody/tr/td[1]/a')).getText();

        assert.match(tableValueOfSearch, patronRegExp, 'El valor del input no coincide con el texto de búsqueda.');
    });

    it('Debe abrir la página principal de Google', async function () {
        await driver.get(BASE_URL);
        const searchNavItemOwners = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]'));
        await searchNavItemOwners.click();
        const searchNavItemOwnersSearch = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]/ul/li[1]/a'));
        await searchNavItemOwnersSearch.click();
        const searchInputOweners = await driver.findElement(By.xpath('//*[@id="lastName"]'));
        const desiredValueForSearch = 'Flores';
        await searchInputOweners.sendKeys(desiredValueForSearch, Key.RETURN);
        const patronRegExp = new RegExp(desiredValueForSearch);


        const tableValueOfSearch = await driver.findElement(By.xpath('//*[@id="ownersTable"]/table/tbody/tr/td[1]/a')).getText();

        assert.match(tableValueOfSearch, patronRegExp, 'El valor del input no coincide con el texto de búsqueda.');
    });
});