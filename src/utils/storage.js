import defaultConfig from '../json/defaultConfig.json';
import { FFF_CONFIGURATION } from './consts';
import { isObjectEmpty } from './index';

export function setStorageSyncValue(key, value = "") {
    chrome.storage.sync.set({[key]: value}, function() {
        console.log('Value is set to ' + value);
    });
}

export function getStorageSyncValue(key, json = true) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result = {}) {
            if (json) {
                const response = result ? result[key] || "{}" : "{}";

                resolve(JSON.parse(response));
            } else {
                resolve(result[key]);
            }
        });
    });
}

export async function getConfiguration() {
    const savedConfiguration = await getStorageSyncValue(FFF_CONFIGURATION);

    return isObjectEmpty(savedConfiguration) ? defaultConfig : savedConfiguration;
}
