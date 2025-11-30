export function qs(selector, scope = document) {
    return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

export function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    return el;
}

export const $ = qs;
