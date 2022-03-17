function setValueToInput(inputSelector = "", inputValue = "") {
    const element = document.querySelector(inputSelector)

    if (element) {
        element.value = inputValue;
        element.setAttribute('value', inputValue);
        element.dispatchEvent(new Event('change'));
        element.dispatchEvent(new Event('blur'));
    } else {
        console.log(`Element ${inputSelector} is not foundable on opened page.`);
    }
}

function getStorageSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result = {}) {
            const response = result[key] || "{}";
            resolve(JSON.parse(response));
        });
    });
}

async function setValuesToInputs() {
    try {
        const savedValues = await getStorageSyncValue('FFF_SAVED_VALUES');

        for(let key in savedValues) {
            setValueToInput(savedValues[key].selector, savedValues[key].value);
        }
    } catch (error) {
        console.error(error)
    };
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

onload = async function() {
    const status = await getStorageSyncValue('FFF_STATUS', false);

    if (status === 'on') {
        setValuesToInputs();
    }
}
