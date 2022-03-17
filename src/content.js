import { getStorageSyncValue } from './utils/storage';

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

onload = async function() {
    const status = await getStorageSyncValue('FFF_STATUS', false);

    if (status === 'on') {
        setValuesToInputs();
    }
}
