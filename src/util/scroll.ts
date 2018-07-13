import { isIOS } from "react-device-detect";

export function noScroll() {
    if (isIOS) {
        document.body.classList.add("noscroll-ios");
        document.documentElement.classList.add("noscroll-ios");
    } else {
        document.body.classList.add("noscroll");
        document.documentElement.classList.add("noscroll");
    }
}

export function removeNoScroll() {
    if (isIOS) {
        document.body.classList.remove("noscroll-ios");
        document.documentElement.classList.remove("noscroll-ios");
    } else {
        document.body.classList.remove("noscroll");
        document.documentElement.classList.remove("noscroll");
    }
}
