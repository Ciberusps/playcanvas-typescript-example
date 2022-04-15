const urlParams = new URLSearchParams(window.location.search);

export const IS_DEV = Boolean(urlParams.get("debug") === "true");
