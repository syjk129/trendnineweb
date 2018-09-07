import * as React from "react";

import "./style.scss";

interface LinkButtonProps {
    url: string;
    className?: string;
    children: React.ReactNode;
}

export default function LinkButton({ url, className, children }: LinkButtonProps) {
    let classes = "link-button";
    if (className) {
        classes += ` ${className}`;
    }

    return (
        <a href={url} className={classes}>
            {children}
        </a>
    );
}
