import * as React from "react";
import { isMobile } from "react-device-detect";

import "./style.scss";

interface CardContainerProps {
    gridSize?: number;
    children?: React.ReactNode;
    className?: string;
}

export default function CardContainer({ gridSize, children, className }: CardContainerProps) {
    let classes = "card-container";
    if (className) {
        classes += ` ${className}`;
    }

    if (gridSize) {
        classes += ` grid-size-${gridSize}`;
    }

    if (isMobile) {
        classes += " mobile";
    }

    return (
        <div className={ classes } id="card-container">
            { children }
        </div>
    );
}
