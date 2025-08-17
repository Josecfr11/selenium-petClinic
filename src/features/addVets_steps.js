const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
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

// Paso 1: "Dado que entro a la pagina principal de petClinic"
Given('que entro a la pagina principal de petClinic', async function () {
    driver = await getDriver();
    await driver.get('http://localhost:4200/petclinic/welcome');
});

// Paso 2: "Cuando navego a la página principal de Veterinarios"
When('navego a la página principal de Veterinarios', async function () {
    const navItemVets = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[3]/a'));
    await navItemVets.click();
    const optionAddNewVet = await driver.findElement(By.xpath('/html/body/app-root/div[1]/nav/div/ul/li[3]/ul/li[2]/a'));
    await optionAddNewVet.click();
});

// Paso 3: "Y lleno el campo de nombre con el valor de..."
When('lleno el campo de nombre con el valor de {string}', async function (firstName) {
    const firstNameInput = await driver.findElement(By.id('firstName'));
    await firstNameInput.sendKeys(firstName);
});

// Paso 4: "Y lleno el campo de apellido con el valor de..."
When('lleno el campo de apellido con el valor de {string}', async function (lastName) {
    const lastNameInput = await driver.findElement(By.id('lastName'));
    await lastNameInput.sendKeys(lastName);
});

// Paso 5: "Y selecciono el tipo de veterinario como..."
When('selecciono el tipo de veterinario como {string}', async function (vetType) {
    const typeSelect = await driver.findElement(By.id('specialties'));
    const select = new Select(typeSelect);
    await select.selectByVisibleText(vetType);
});

When('doy clic en boton guardar', async function () {
    const saveBtn = await driver.findElement(By.css('button[type="submit"]'));
    await saveBtn.click();
});

// Paso 6: "Entonces debo de poder visualizar el nombre de..."
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

    assert.ok(listOfNames.includes(fullName)),
        `El veterinario "${fullName}" no se encontró en la lista de resultados.`
        ;

    assert.ok(listOfSpecialties.includes(specialty)),
        `El veterinario con especialdad "${specialty}" no se encontró en la lista de resultados.`
        ;

});