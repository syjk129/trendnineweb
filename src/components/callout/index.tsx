import * as React from "react";

import { IconVariant } from "../icon";

import "./style.scss";

export enum CalloutVariant {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    MUTED = "muted",
}

interface CalloutProps {
    icon?: IconVariant;
    variant?: CalloutVariant;
    muted?: boolean;
    inline?: boolean;
    children: React.ReactNode;
}

export default function Callout({ icon, variant, muted, inline, children }: CalloutProps) {
    let classes = "callout";

    switch (variant) {
        case CalloutVariant.PRIMARY:
            classes += " primary";
            break;
        case CalloutVariant.SECONDARY:
            classes += " secondary";
            break;
        case CalloutVariant.MUTED:
            classes += " muted";
            break;
    }

    if (inline) {
        classes += " inline";
    }

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
