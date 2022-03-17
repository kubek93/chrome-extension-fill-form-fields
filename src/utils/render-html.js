import { toCamelCase } from './index';

export function renderEmptyInfo() {
    const parent = document.querySelector('#form-data');
    const div = document.createElement("div");
    const description = document.createElement("p");

    description.innerText = "Configuration is empty! Open the extension option page and add there json config."

    div.appendChild(description);
    parent.appendChild(div);
}

export function renderInput(name, selector = "") {
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

export function renderSelect(name, options = [], selector = "") {
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
