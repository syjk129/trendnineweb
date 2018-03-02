import * as React from "react";

import "./style.scss";

interface IconProps {
    className?: string;
    children?: React.ReactNode;
}

export default function Icon({ className, children }: IconProps) {
    let classes = "icon";
    if (className) {
        classes += ` ${className}`;
    }

    return (
        <span className={classes}></span>
    );
}
