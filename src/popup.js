import { setStorageSyncValue, getStorageSyncValue } from './utils/storage';
import { renderEmptyInfo, renderInput, renderSelect } from './utils/render-html';
import { FFF_STATUS, FFF_CONFIGURATION, FFF_SAVED_VALUES } from './utils/consts';

function setBadge(text = "") {
    chrome.action.setBadgeText({ text });
}

async function displayFields() {
    const configuration = await getStorageSyncValue(FFF_CONFIGURATION);

    if (!configuration.fields) {
        renderEmptyInfo();
    }

    configuration.fields && configuration.fields.forEach(field => {
        if (field.options && field.options.length) {
            renderSelect(field.label, field.options, field.selector);
        } else {
            renderInput(field.label, field.selector);
        }
    });
}

async function setFormValues() {
    const savedValues = await getStorageSyncValue(FFF_SAVED_VALUES);
    const form = document.getElementById('form-data');

    for (const key in savedValues) {
        form.elements[key].value = savedValues[key].value;
    }
}

function clearForm() {
    const clearButton = document.getElementById("clear-form-data");

    clearButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.localStorage.removeItem(FFF_SAVED_VALUES);
        window.location.reload();
    });
}

function submitForm() {
    const form = document.getElementById('form-data');
    const objectToSave = {};

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        for (let i = 0; i < form.elements.length; i++) {
            const { dataset, id, value } = form.elements[i];
            const { selector } = dataset;

            if (id && value) {
                objectToSave[id] = {
                    id,
                    value,
                    selector
                };
            }
        }

        setStorageSyncValue(FFF_SAVED_VALUES, JSON.stringify(objectToSave));
        window.localStorage.setItem(FFF_SAVED_VALUES, JSON.stringify(objectToSave));
    });
}

async function checkStatus() {
    const body = document.querySelector('body.popup');
    const buttonOn = document.getElementById('button-on');
    const buttonOff = document.getElementById('button-off');

    try {
        const isActive = await getStorageSyncValue(FFF_STATUS, false);

        if (isActive === "on") {
            setBadge("ON");
            body.classList.add('active');
            buttonOn.classList.add('disabled');
            buttonOff.classList.remove('disabled');
            return;
        }

        body.classList.remove('active');
        buttonOn.classList.remove('disabled');
        buttonOff.classList.add('disabled');
        setBadge("OFF");
        return;
    } catch (error) {
        console.error(error)
    };
}

async function configureButtons() {
    const buttonOn = document.getElementById('button-on');
    const buttonOff = document.getElementById('button-off');

    buttonOn.addEventListener('click', async () => {
        await setStorageSyncValue(FFF_STATUS, "on");
        await checkStatus();
    });

    buttonOff.addEventListener('click', async () => {
        buttonOn.classList.add('disabled');
        buttonOff.classList.remove('disabled');
        await setStorageSyncValue(FFF_STATUS, "off");
        await checkStatus();
    });
}

async function main() {
    await checkStatus();
    await displayFields();
    configureButtons();
    setFormValues();
    clearForm();
    submitForm();
}

main();
