import * as React from "react";

import "./style.scss";

interface CardContainerProps {
    children?: React.ReactNode;
}

export default function CardContainer({ children }: CardContainerProps) {
    return (
        <div className="card-container">
            {children}
        </div>
    );
}
