import * as React from "react";

import "./style.scss";

interface ListContainerProps {
    children: React.ReactNode;
}

export default function ListContainer({ children }: ListContainerProps) {
    return (
        <div className="list-container">
            {children}
        </div>
    );
}
