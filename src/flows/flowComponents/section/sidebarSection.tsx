import * as React from "react";

import "./style.scss";

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SidebarSection({ title, children }: SidebarSectionProps) {
    return (
        <div className="sidebar-section">
            <div className="sidebar-header">
                {title}
            </div>
            {children}
        </div>
    );
}
