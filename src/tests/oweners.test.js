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
        const desiredValueForSearch = 'Perez';
        await searchInputOweners.sendKeys(desiredValueForSearch, Key.RETURN);
        const patronRegExp = new RegExp(desiredValueForSearch);
        const tableValueOfSearch = await driver.findElement(By.xpath('//*[@id="ownersTable"]/table/tbody/tr/td[1]/a')).getText();

        assert.match(tableValueOfSearch, patronRegExp, 'El valor del input no coincide con el texto de búsqueda.');
    });

    it('Debe de encontrar solo resultados que coincidan con el ingresado en el campo de busqueda', async function () {
        await driver.get(BASE_URL);
        const searchNavItemOwners = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]'));
        await searchNavItemOwners.click();
        const searchNavItemOwnersSearch = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]/ul/li[1]/a'));
        await searchNavItemOwnersSearch.click();
        const searchInputOweners = await driver.findElement(By.xpath('//*[@id="lastName"]'));
        const desiredValueForSearch = 'Davis';
        await searchInputOweners.sendKeys(desiredValueForSearch, Key.RETURN);

        const tableValuesOfSearch = await driver.findElements(By.css('td.ownerFullName  > a'));
        let listOfNames = [];
        for (const result of tableValuesOfSearch) {
            const names = await result.getText();
            listOfNames.push(names);
        }

        for (const name of listOfNames) {
            assert.ok(
                name.includes(desiredValueForSearch),
                `El elemento esperado "${desiredValueForSearch}" no se encontró en la lista de resultados.`
            );
        }
    });

    it('Debe de registrar correctamente un nuevo dueño de mascota', async function () {
        await driver.get(BASE_URL);
        const navItemOwners = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]'));
        await navItemOwners.click();
        const navItemOwnersAddNew = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[2]/ul/li[2]/a'));
        await navItemOwnersAddNew.click();
        const firstNameInput = await driver.findElement(By.id('firstName'));
        const lastNameInput = await driver.findElement(By.id('lastName'));
        const addressInput = await driver.findElement(By.id('address'));
        const cityInput = await driver.findElement(By.id('city'));
        const telephoneInput = await driver.findElement(By.id('telephone'));

        const testForm = {
            firstName: 'Marcelo',
            lastName: 'Diaz',
            address: 'Nuevo Leon',
            city: 'Monterrey',
            telephone: '5546654882'
        }

        await firstNameInput.sendKeys(testForm.firstName);
        await lastNameInput.sendKeys(testForm.lastName);
        await addressInput.sendKeys(testForm.address);
        await cityInput.sendKeys(testForm.city);
        await telephoneInput.sendKeys(testForm.telephone, Key.RETURN);

        const errorAlerts = await driver.findElements(By.className('help-block'));
        if (errorAlerts.length > 0) {
            const errorText = errorAlerts[0].getValue();
            assert.ok(!errorText, 'Se ingresó algún dato inválido en el formulario');
        }

        const tableValuesOfSearch = await driver.findElements(By.css('td.ownerFullName  > a'));
        let listOfNames = [];
        for (const result of tableValuesOfSearch) {
            const names = await result.getText();
            listOfNames.push(names);
        }

        assert.ok(
            listOfNames.includes(testForm.firstName.concat(' ', testForm.lastName)),
            `El dueño de mascota "${testForm.firstName} ${testForm.lastName}" no se encontró en la lista de resultados.`
        );
    });
});