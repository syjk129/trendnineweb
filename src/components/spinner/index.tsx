import * as React from "react";

import "./style.scss";

export default function Spinner() {
    return (
        <div className="spinner" />
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
