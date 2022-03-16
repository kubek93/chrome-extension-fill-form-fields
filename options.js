const FFF_CONFIGURATION = 'FFF_CONFIGURATION';

function setStorageSyncValue(key, value = "") {
    chrome.storage.sync.set({[key]: value}, function() {
        console.log('Value is set to ' + value);
    });
}

const defaultConfigurationJson = {
    "title": "FFF - Fill Form Fields",
    "fields": [
        {
            "key": "googleSearch",
            "label": 'Google Search',
            "selector": 'body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input',
            "type": 'select',
            "options": ['Fill Form Fields Google Chrome Extension', 'Custom Query']
        },
        {
            "key": 'googleMapsSearch',
            "label": 'Google Maps Search',
            "selector": '#searchboxinput'
        }
    ]
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            resolve(result[key]);
        });
    });
}

const initialJson = {
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
}

async function getConfiguration() {
    const savedConfiguration = await getStorageSyncValue(FFF_CONFIGURATION);

    return savedConfiguration ? savedConfiguration : defaultConfigurationJson;
}

async function init() {
    const container = document.getElementById("jsoneditor")
    const options = {}
    const editor = new JSONEditor(container, options)

    try {
        const configuration = await getConfiguration();
        editor.set(JSON.parse(configuration));
    } catch (error) {
        throw new Error('Configuration pull failed.')
    }

    const submitConfigurationButton = document.getElementById('submit-configuration');
    submitConfigurationButton.addEventListener('click', () => {
        const configurationJson = editor.get();
        const configurationJsonStringify = JSON.stringify(configurationJson);

        setStorageSyncValue(FFF_CONFIGURATION, configurationJsonStringify);
    });
}

init();
