const FFF_STATUS = 'FFF_STATUS';
const FFF_CONFIGURATION = 'FFF_CONFIGURATION';
const FFF_SAVED_VALUES = 'FFF_SAVED_VALUES';

function toCamelCase(str = "") {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function getStorageSyncValue(key, json = true) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            if (json) {
                const response = result ? result[key] : "{}";

                resolve(JSON.parse(response));
            } else {
                resolve(result[key]);
            }
        });
    });
}

function setStorageSyncValue(key, value = "") {
    chrome.storage.sync.set({[key]: value}, function() {
        console.log('Value is set to ' + value);
    });
}

function setBadge(text = "") {
    chrome.action.setBadgeText({ text });
}

function renderInput(name, selector = "") {
    const parent = document.querySelector('#form-data');
    const div = document.createElement("div");
    const label = document.createElement('label');
    const input = document.createElement('input');
    label.setAttribute('for', toCamelCase(name));
    label.innerText = name;
    input.setAttribute('id', toCamelCase(name));
    input.setAttribute('type', 'text');
    input.dataset.selector = selector;

    div.appendChild(label);
    div.appendChild(input);

    parent.appendChild(div);
}

function renderSelect(name, options = [], selector = "") {
    const parent = document.querySelector('#form-data');
    const div = document.createElement("div");
    const label = document.createElement('label');
    const select = document.createElement('select');
    label.setAttribute('for', toCamelCase(name));
    label.innerText = name;
    select.setAttribute('id', toCamelCase(name));
    select.dataset.selector = selector;

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        select.appendChild(option);
    }

    div.appendChild(label);
    div.appendChild(select);

    parent.appendChild(div);
}

async function displayFields() {
    const configuration = await getStorageSyncValue(FFF_CONFIGURATION);

    configuration.fields.forEach(field => {
        if (field.type === "select") {
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
