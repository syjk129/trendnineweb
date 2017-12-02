import * as React from "react";

import "./style.scss";

interface ContentProps {
    children: React.ReactChild;
}

export default function Content({ children }: ContentProps) {
    return (
        <div className="content">
            {children}
        </div>
    );
}
