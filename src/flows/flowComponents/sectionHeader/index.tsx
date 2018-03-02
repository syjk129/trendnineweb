import * as React from "react";

import "./style.scss";

interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="section-header">
            {title}
        </div>
    );
}
