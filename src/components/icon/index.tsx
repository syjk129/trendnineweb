import * as React from "react";

import "./style.scss";

export enum IconVariant {
    // TODO: add in variants
}

interface IconProps {
    className?: string;
    variant?: IconVariant;
    children?: React.ReactNode;
}

export default function Icon({ className, variant, children }: IconProps) {
    let classes = "icon";
    if (className) {
        classes += ` ${className}`;
    }

    // TODO: add variant to set icons
    switch (variant) {
        default:
            break;
    }

    return (
        <span className={classes}></span>
    );
}
