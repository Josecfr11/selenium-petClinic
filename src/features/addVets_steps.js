const { Given, When, Then, After } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { Select } = require('selenium-webdriver/lib/select');

const { getDriver, quitDriver } = require('../../src/utils/driverManager');

let driver;

After(async function () {
    if (driver) {
        await quitDriver(driver);
    }
});

Given('que entro a la pagina principal de petClinic', async function () {
    driver = await getDriver();
    await driver.get('http://localhost:4200/petclinic/welcome');
});

When('navego a la página principal de Veterinarios', async function () {
    const navItemVets = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[3]/a'));
    await navItemVets.click();
    const optionAddNewVet = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[3]/ul/li[2]/a'));
    await optionAddNewVet.click();
});

When('lleno el campo de nombre con el valor de {string}', async function (firstName) {
    const firstNameInput = await driver.findElement(By.id('firstName'));
    await firstNameInput.sendKeys(firstName);
    const InvalidFirstNameInput = await driver.findElements(By.css('input + span.help-block'));
    if (InvalidFirstNameInput.length > 0) {
        const errorText = await InvalidFirstNameInput[0].getText();
        assert.ok(!errorText, `El valor "${firstName}" es inválido. Mensaje de error  "${errorText}"`);

    }
});

When('lleno el campo de apellido con el valor de {string}', async function (lastName) {
    const lastNameInput = await driver.findElement(By.id('lastName'));
    await lastNameInput.sendKeys(lastName);
});

When('selecciono el tipo de veterinario como {string}', async function (vetType) {
    const typeSelect = await driver.findElement(By.id('specialties'));
    const select = new Select(typeSelect);
    await select.selectByVisibleText(vetType);
});

When('doy clic en boton guardar', async function () {
    const saveBtn = await driver.findElement(By.css('button[type="submit"]'));
    const isEnabled = await saveBtn.isEnabled();

    assert.strictEqual(isEnabled, true, 'El botón de guardar está deshabilitado en por campo invalido');

    await saveBtn.click();
});

Then('debo de poder visualizar el nombre de {string} con especialidad de {string}', async function (fullName, specialty) {
    await driver.wait(until.elementLocated(By.id('vets')), 5000);

    const tableValuesOfSearchNames = await driver.findElements(By.css('tr > td:nth-child(1)'));

    let listOfNames = [];
    for (const result of tableValuesOfSearchNames) {
        const name = await result.getText();
        listOfNames.push(name);
    }

    const tableValuesOfSearchSpecialty = await driver.findElements(By.css('tr > td:nth-child(2)'));

    let listOfSpecialties = [];

    for (const result of tableValuesOfSearchSpecialty) {
        const specialty = await result.getText();
        listOfSpecialties.push(specialty);
    }

    const indexOfName = findIndexName(listOfNames, fullName);


    assert.ok(listOfNames.includes(fullName)),
        `El veterinario "${fullName}" no se encontró en la lista de resultados.`
        ;

    console.log(listOfSpecialties[indexOfName]);

    assert.ok(listOfSpecialties[indexOfName] === specialty),
        `El veterinario con especialdad "${specialty}" no se encontró en la lista de resultados.`
        ;

});

function findIndexName(listOfNames, fullName) {
    if (listOfNames.includes(fullName)) {
        return indexOfName = listOfNames.indexOf(fullName)
    }
}