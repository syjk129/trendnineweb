import * as React from "react";

import "./style.scss";

interface CardContainerProps {
    children?: React.ReactNode;
    className?: string;
}

export default function CardContainer({ children, className }: CardContainerProps) {
    let classes = "card-container";
    if (className) {
        classes += ` ${className}`;
    }

    return (
        <div className={ classes }>
            { children }
        </div>
    );
}
