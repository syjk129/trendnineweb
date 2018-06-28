function cookieExists(cookieName: string) {
    if (document.cookie.split(";").filter((item) => item.includes(`${cookieName}=`)).length) {
        return true;
    }
    return false;
}

function setCookie(cookieName: string, value: string, expiration?: Date) {
    let expirationDate = "";
    if (expiration) {
        expirationDate = `; expires=${expiration.toUTCString()}`;
    }

    document.cookie = `${cookieName}=${value}`;
}

function getCookie(cookieName: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) {
        return match[2];
    }
    return null;
}

const Cookies = {
    cookieExists,
    setCookie,
    getCookie,
};

export default Cookies;
