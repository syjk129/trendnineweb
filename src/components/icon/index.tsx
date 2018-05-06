import autobind from "autobind-decorator";
import * as React from "react";

import { IconMap, IconVariant } from "./types";

import "./style.scss";

interface IconProps {
    variant: IconVariant;
    selected?: boolean;
    className?: string;
    large?: boolean;
    withHoverStyles?: boolean;
    children?: React.ReactNode;
}

interface IconState {
    className: string;
}

export default function Icon({
    selected,
    className,
    large,
    withHoverStyles,
    variant,
    children,
}: IconProps) {
    let classes = `icon icon-${selected ? IconMap[variant] : variant}`;

    if (large) {
        classes += " large";
    }

    return (
        <span className={classes} />
    );
}

export * from "./types";
