import * as React from "react";

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
