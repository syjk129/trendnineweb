import * as React from "react";

import "./style.scss";

export enum ButtonVariant {
    PRIMARY = "primary",
    OUTLINE = "outline",
}

interface ButtonProps {
    className?: string;
    inline?: boolean;
    variant?: ButtonVariant;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function Button({ className, inline, variant, children, onClick }: ButtonProps) {
    let classes = "button";
    if (className) {
        classes += ` ${className}`;
    }

    if (inline) {
        classes += " button-inline";
    }

    switch (variant) {
        case ButtonVariant.PRIMARY:
            classes += " button-primary";
            break;
        case ButtonVariant.OUTLINE:
            classes += " button-outline";
            break;
        default:
            classes += " button-primary";
            break;
    }

    return (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    );
}
