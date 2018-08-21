import * as React from "react";

import "./style.scss";

interface SpinnerProps {
    noPadding?: boolean;
    flat?: boolean;
}

export default function Spinner({ flat, noPadding }: SpinnerProps) {
    let classes;
    if (flat) {
        classes = "flat-spinner";
    } else {
        classes = "spinner";
    }

    if (noPadding) {
        classes += " no-padding";
    }
    return (
        <div className={classes}><div></div><div></div><div></div><div></div></div>
    );
}

interface SpinnerContainerProps {
    children: React.ReactNode;
}

export function SpinnerContainer({ children }: SpinnerContainerProps) {
    return (
        <div className="spinner-container">
            {children}
        </div>
    );
}
