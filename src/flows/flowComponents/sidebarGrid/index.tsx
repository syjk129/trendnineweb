import * as React from "react";

import "./style.scss";

interface SidebarGridProps {
    children: React.ReactNode;
}

export default function SidebarGrid({ children }: SidebarGridProps) {
    return (
        <div className="sidebar-grid">
            {children}
        </div>
    );
}
