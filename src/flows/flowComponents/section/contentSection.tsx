import * as React from "react";

import "./style.scss";

interface ContentSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function ContentSection({ title, children }: ContentSectionProps) {
    return (
        <div className="content-section">
            <div className="content-header">
                {title}
            </div>
            {children}
        </div>
    );
}
