import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";

import getIconForVariant from "./getIconForVariant";
import SocialIcon from "./socialIcon";
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
    const icon = getIconForVariant(selected ? IconMap[variant] : variant);
    let classes = "icon";

    if (isMobile) {
        classes += " mobile";
    }

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
        <img src={icon} className={classes} />
    );
}

export { SocialIcon };

export * from "./types";
