class FacebookLoginResponse {
    code: string;
    error?: string;
}

const CALLBACK_URL_PATH = "/facebook/callback";

export default function FacebookShare(appId: string, pathname: string, callBack: (response: FacebookLoginResponse) => void) {
    const width = 450;
    const height = 300;
    const x = screen.width / 2 - width / 2;
    const y = screen.height / 2 - height / 2;

    let url = "https://www.facebook.com/dialog/share?" +
        `app_id=${appId}` +
        `&display=popup` +
        `&href=https://beta.trendnine.com/${pathname}` +
        `&redirect_uri=https://beta.trendnine.com`;

    let externalWindow = window.open(url, "_blank", `width=${width},height=${height},left=${x},top=${y},status=yes`);
    _detectUrlChange(externalWindow, callBack);
}

function _detectUrlChange(externalWindow: Window, callbackOnLogin: (response: FacebookLoginResponse) => void) {
    const interval = setInterval(function() {
        if (externalWindow.location.pathname && externalWindow.location.pathname.endsWith(CALLBACK_URL_PATH)) {
            const code = new URL(externalWindow.location.href).searchParams.get("code");

            // call provided callback function
            callbackOnLogin({ code: code });

            // clean interval and close window.
            clearInterval(interval);
            externalWindow.close();
        }
    }, 500);
}
