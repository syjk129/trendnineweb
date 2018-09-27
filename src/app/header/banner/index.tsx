import * as React from "react";
import { isMobile } from "react-device-detect";

import "./style.scss";

interface BannerProps {
    children: React.ReactNode;
    actionButton: React.ReactNode;
    onDismiss(): void;
}

export default function Banner({ children, actionButton, onDismiss }: BannerProps) {
    return (
        <div className={`banner${isMobile ? " mobile" : ""}`}>
            <div className="banner-content">
                <div className="banner-text">
                    {children}
                </div>
                <span className="banner-actions">
                    {actionButton}
                    <span className="close" onClick={onDismiss}>&times;</span>
                </span>
            </div>
        </div>
    );
}
