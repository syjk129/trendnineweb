import * as React from "react";

import "./style.scss";

export enum AnchorVariant {
    PRIMARY = "primary",
    SECONDARY = "secondary",
}

interface AnchorProps {
    className?: string;
    variant?: AnchorVariant;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function Anchor({ className, variant, children, onClick }: AnchorProps) {
    let classes = "anchor";
    if (className) {
        classes += ` ${className}`;
    }

    switch (variant) {
        case AnchorVariant.PRIMARY:
            classes += " anchor-primary";
            break;
        case AnchorVariant.SECONDARY:
            classes += " anchor-secondary";
            break;
        default:
            classes += " anchor-primary";
            break;
    }

    return (
        <a className={classes} onClick={onClick}>
            {children}
        </a>
    );
}
