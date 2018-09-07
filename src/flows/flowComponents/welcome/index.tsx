import * as React from "react";

import Button, { ButtonVariant } from "../../../components/button";

export default function WelcomeBanner() {
    return (
        <div className="welcome-banner">
            <div className="welcome-title">
                Welcome to TrendNine
            </div>
            <div className="welcome-title">
                Quick Blurb about TrendNine
            </div>
            <div className="welcome-actions">
                <Button inline variant={ButtonVariant.OUTLINE}>Get started</Button>
                <Button inline variant={ButtonVariant.OUTLINE}>Learn more</Button>
            </div>
        </div>
    );
}
