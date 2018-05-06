import autobind from "autobind-decorator";
import * as React from "react";

import { IconMap, IconSize, IconVariant } from "./types";

import "./style.scss";

interface IconProps {
    variant: IconVariant;
    selected?: boolean;
    className?: string;
    size?: IconSize;
    withHoverStyles?: boolean;
    children?: React.ReactNode;
}

interface IconState {
    className: string;
}

export default function Icon({
    selected,
    className,
    size,
    withHoverStyles,
    variant,
    children,
}: IconProps) {
    let classes = `icon icon-${selected ? IconMap[variant] : variant}`;

    switch (size) {
        case IconSize.LARGE:
            classes += " large";
            break;
        case IconSize.MEDIUM:
            classes += " medium";
            break;
        case IconSize.SMALL:
            classes += " small";
            break;
    }

    return (
        <span className={classes} />
    );
}

export * from "./types";
