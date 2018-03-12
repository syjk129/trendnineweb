import * as React from "react";

import "./style.scss";

interface SidebarHeaderProps {
    title: string;
}

export default function SidebarHeader({ title }: SidebarHeaderProps) {
    return (
        <div className="sidebar-header">
            {title}
        </div>
    );
}
