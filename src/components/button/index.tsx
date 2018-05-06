import * as React from "react";

import IconButton from "./iconButton";
import LinkButton from "./linkButton";

import { ButtonSize, ButtonVariant } from "./types";

import "./style.scss";

interface ButtonProps {
    className?: string;
    inline?: boolean;
    rounded?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function Button({
    className,
    inline,
    rounded,
    variant,
    size,
    children,
    onClick,
}: ButtonProps) {
    let classes = "button";
    if (className) {
        classes += ` ${className}`;
    }

    if (inline) {
        classes += " button-inline";
    }

    if (rounded) {
        classes += " rounded";
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

    switch (size) {
        case ButtonSize.WIDE:
            classes += " button-wide";
            break;
    }

    return (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    );
}

export {
    ButtonSize,
    ButtonVariant,
    IconButton,
    LinkButton,
};
