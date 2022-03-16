const FFF_CONFIGURATION = 'FFF_CONFIGURATION';
const FFF_SAVED_VALUES = 'FFF_SAVED_VALUES';

function toCamelCase(str = "") {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            resolve(JSON.parse(result[key]));
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
        console.log('field', field);
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

// async function checkPluginStatus() {
//     try {
//         const isActiveKey = "gpp-form-active";
//         const isActive = await getStorageSyncValue(isActiveKey)
//         if (isActive === undefined) {
//             setStorageSyncValue(isActiveKey, "false");
//         }

//         if (isActive === "true") {
//             setStorageSyncValue(isActiveKey, "false");
//         }

//         if (isActive === "false") {
//             setStorageSyncValue(isActiveKey, "true");
//         }

//         await setupStatus();
//     } catch (error) {
//         console.error(error)
//     };
// }
// function pluginStatus() {
//     const button = document.getElementById('button');
//     button && button.addEventListener('click', async (e) => {
//         checkPluginStatus();
//     })
// }
// pluginStatus();

// async function setupStatus() {
//     try {
//         const isActiveKey = "gpp-form-active";
//         const isActive = await getStorageSyncValue(isActiveKey)

//         if (isActive === "true") {
//             setBadge("ON");
//             return;
//         }

//         setBadge("OFF");
//     } catch (error) {
//         console.error(error)
//     };
// }
// setupStatus();

async function main() {
    await displayFields();
    setFormValues();
    clearForm();
    submitForm();
}

main();
