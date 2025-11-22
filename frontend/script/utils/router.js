function computePrefix() {
    const path = window.location.pathname;

    if (path.includes("/pages/")) return "";

    return "pages/";
}

export function goTo(target) {
    let final = target;
    
    if (!target.startsWith("pages/") && !target.startsWith("../")) {
        const prefix = computePrefix();
        final = prefix + target;
    }

    window.location.href = final;
}

export function goBack() {
    window.history.back();
}

export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}