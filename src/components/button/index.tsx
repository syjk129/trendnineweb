import * as React from "react";

import IconButton from "./iconButton";
import LinkButton from "./linkButton";

import { ButtonSize, ButtonVariant } from "./types";

import "./style.scss";

interface ButtonProps {
    className?: string;
    inline?: boolean;
    rounded?: boolean;
    white?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?(event?: React.FormEvent): void;
}

export default function Button({
    className,
    inline,
    rounded,
    white,
    variant,
    size,
    children,
    disabled,
    onClick,
}: ButtonProps) {
    let classes = "button";
    if (rounded) {
        classes += " rounded";
    }

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
        case ButtonVariant.SECONDARY:
            classes += " button-secondary";
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
        case ButtonSize.SMALL:
            classes += " button-small";
            break;
    }

    if (white) {
        classes += " white";
    }

    return (
        <button type="button" className={classes} onClick={onClick} disabled={disabled}>
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
