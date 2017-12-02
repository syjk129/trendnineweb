import * as React from "react";

import "./style.scss";

interface SidebarProps {
    children: React.ReactChild;
}

export default function Sidebar({ children }: SidebarProps) {
    return (
        <div className="sidebar">
            {children}
        </div>
    );
}
