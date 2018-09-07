import * as React from "react";
import { Link } from "react-router-dom";

import IconButton from "./iconButton";
import ImageUploadButton from "./imageUploadButton";
import LinkButton from "./linkButton";

import { ButtonSize, ButtonVariant } from "./types";

import "./style.scss";

interface ButtonProps {
    className?: string;
    inline?: boolean;
    url?: string;
    rounded?: boolean;
    small?: boolean;
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
    small,
    url,
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
        case ButtonVariant.SECONDARY:
            classes += " button-secondary";
            break;
        case ButtonVariant.OUTLINE:
            classes += " button-outline";
            break;
        case ButtonVariant.SECONDARY_OUTLINE:
            classes += " button-secondary-outline";
            break;
        case ButtonVariant.BLANK:
            classes += " button-blank";
            break;
        case ButtonVariant.TOP:
            classes += " button-top";
            break;
        case ButtonVariant.PRIMARY:
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
        case ButtonSize.VERY_SMALL:
            classes += " button-very-small";
            break;
    }

    if (small) {
        classes += " small";
    }

    if (white) {
        classes += " white";
    }

    if (url) {
        return (
            <Link to={url}>
                <button type="button" className={classes} onClick={onClick} disabled={disabled}>
                    {children}
                </button>
            </Link>
        );
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
    ImageUploadButton,
    LinkButton,
};
