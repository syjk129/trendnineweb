import * as React from "react";

import "./style.scss";

interface ContentProps {
    children?: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
    return (
        <div className="content" id="content">
            {children}
        </div>
    );
}
