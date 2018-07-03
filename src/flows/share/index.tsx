import * as React from "react";

import Button, { ButtonSize, LinkButton } from "../../components/button";
import Modal from "../../components/modal";
import RouteProps from "../routeProps";

import "./style.scss";

interface ShareProps extends RouteProps {
    close(): void;
}

export default function ShareModal({ close, location, match }: ShareProps) {
    let shareUrl;
    const url = match.params.url.split("/").filter(path => path !== "");
    if (url.length === 2) {
        shareUrl = match.params.url;
    } else if (match.params.shareType && match.params.shareId) {
        shareUrl = `${match.params.shareType}/${match.params.shareId}`;
    } else {
    }
    const shareLink = `${window.location.hostname}/${shareUrl}`;

    return (
        <Modal className="share-modal" isOpen close={close}>
            <div className="share-modal-content">
                <p className="share-title">Share</p>
                <Button
                    className="share-button facebook"
                    size={ButtonSize.SMALL}
                    onClick={() => shareFacebook("201224070695370", shareUrl)}
                >
                    Share to Facebook
                </Button>
                <LinkButton
                    href={`mailto:?subject=I wanted you to see this site&amp;body=Check out this style post on TrendNine! ${shareLink}.`}
                >
                    <Button
                        className="share-button email"
                        size={ButtonSize.SMALL}
                        onClick={() => shareFacebook("201224070695370", `${location.pathname}/${this.props.id}`)}
                    >
                        Share to Email
                    </Button>
                </LinkButton>
            </div>
        </Modal>
    );
}

const CALLBACK_URL_PATH = "/facebook/callback";

function shareFacebook(appId: string, pathname: string) {
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
