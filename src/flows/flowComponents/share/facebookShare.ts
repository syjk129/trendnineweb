class FacebookLoginResponse {
    code: string;
    error?: string;
}

const CALLBACK_URL_PATH = "/facebook/callback";

export default function FacebookShare(appId: string, pathname: string) {
    const width = 450;
    const height = 300;
    const x = screen.width / 2 - width / 2;
    const y = screen.height / 2 - height / 2;

    let url = "https://www.facebook.com/dialog/share?" +
        `app_id=${appId}` +
        `&display=popup` +
        `&href=${window.location.protocol}//${window.location.hostname}/${pathname}` +
        `&redirect_uri=${window.location.protocol}//${window.location.hostname}${CALLBACK_URL_PATH}`;

    let externalWindow = window.open(url, "_blank", `width=${width},height=${height},left=${x},top=${y},status=yes`);
    _detectUrlChange(externalWindow);
}

function _detectUrlChange(externalWindow: Window) {
    const interval = setInterval(function() {
        if (externalWindow.location.pathname && externalWindow.location.pathname.endsWith(CALLBACK_URL_PATH)) {
            const code = new URL(externalWindow.location.href).searchParams.get("code");

            // clean interval and close window.
            clearInterval(interval);
            externalWindow.close();
        }
    }, 500);
}
