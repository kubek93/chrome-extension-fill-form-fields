const configuration = {
    "title": "GPP Fill Form Fields",
    "fields": [
        {
            "label": "Search Query",
            "key": "searchQuery",
            "selector": "#searchQuery"
        },
        {
            "label": "Access Token",
            "key": "accessToken",
            "selector": "#access-token"
        },
        {
            "label": "User ID",
            "selector": "#user-id"
        },
        {
            "label": "Universe",
            "selector": "#universe",
            "type": "select",
            "options": ["wh-eu-de", "wh-mga"]
        },
        {
            "label": "Environment",
            "selector": "#environment",
            "type": "select",
            "options": ["pp1", "pp2", "pp3"]
        },
        {
            "label": "Locale",
            "selector": "#locale",
            "type": "select",
            "options": ["en_US", "en_GB"]
        }
    ]
};

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

async function setupStatus() {
    try {
        const isActiveKey = "gpp-form-active";
        const isActive = await getStorageSyncValue(isActiveKey)

        if (isActive === "true") {
            setBadge("ON");
            return;
        }

        setBadge("OFF");
    } catch (error) {
        console.error(error)
    };
}

async function checkPluginStatus() {
    try {
        const isActiveKey = "gpp-form-active";
        const isActive = await getStorageSyncValue(isActiveKey)
        if (isActive === undefined) {
            setStorageSyncValue(isActiveKey, "false");
        }

        if (isActive === "true") {
            setStorageSyncValue(isActiveKey, "false");
        }

        if (isActive === "false") {
            setStorageSyncValue(isActiveKey, "true");
        }

        await setupStatus();
    } catch (error) {
        console.error(error)
    };
}

function setStorageSyncValue(key, value = "") {
    chrome.storage.sync.set({[key]: value}, function() {
        console.log('Value is set to ' + value);
    });
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            console.log('Value currently is ' + result[key]);
            resolve(result[key]);
        });
    });
}

function setBadge(text = "") {
    chrome.action.setBadgeText({ text });
}

function renderInput(selector, name) {
    const parent = document.querySelector(selector);
    const div = document.createElement("div");
    const label = document.createElement('label');
    const input = document.createElement('input');
    label.setAttribute('for', toCamelCase(name));
    label.innerText = name;
    input.setAttribute('id', toCamelCase(name));
    input.setAttribute('type', 'text');

    div.appendChild(label);
    div.appendChild(input);

    parent.appendChild(div);
}

function renderSelect(selector, name, options = []) {
    const parent = document.querySelector(selector);
    const div = document.createElement("div");
    const label = document.createElement('label');
    const select = document.createElement('select');
    label.setAttribute('for', toCamelCase(name));
    label.innerText = name;
    select.setAttribute('id', toCamelCase(name));

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        select.appendChild(option);
    }

    div.appendChild(label);
    div.appendChild(select);

    console.log('select', select);

    parent.appendChild(div);
}

function displayFields() {
    configuration.fields.forEach(field => {
        if (field.type === "select") {
            renderSelect('#form-data', field.label, field.options);
        } else {
            renderInput('#form-data', field.label);
        }
    });
}

function pluginStatus() {
    const button = document.getElementById('button');
    button && button.addEventListener('click', async (e) => {
        checkPluginStatus();
    })
}

async function setFormValues() {
    const form = document.getElementById('form-data');
    const configuration = window.localStorage.getItem('configuration');
    const parsedConfiguration = JSON.parse(configuration);

    console.log(parsedConfiguration);
    console.log(form.elements);

    for (const key in parsedConfiguration) {
        form.elements[key].value = parsedConfiguration[key]
    }
}

function submitForm() {
    const form = document.getElementById('form-data');
    const objectToSave = {};

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        for (let i = 0; i < form.elements.length; i++) {
            const { id, value, selector } = form.elements[i];

            if (id && value) {
                objectToSave[id] = {
                    selector,
                    value
                };
            }
        }

        setStorageSyncValue('configuration', JSON.stringify(objectToSave));
        window.localStorage.setItem('configuration', JSON.stringify(objectToSave));
    });
}

function clearFormData() {
    const clearButton = document.getElementById("clear-form-data");

    clearButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.localStorage.removeItem('configuration');
        window.location.reload();
    });
}

// <label for="choose">Select</label>
// <select id="choose">
//     <option disabled selected>Please select</option>
//     <option value="option-1">Option 1</option>
//     <option value="option-2">Option 2</option>
// </select>

// pluginStatus();
// setupStatus();
displayFields();
submitForm();
setFormValues();
clearFormData();
