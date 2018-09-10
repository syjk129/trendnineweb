import * as React from "react";
import { isMobile } from "react-device-detect";

interface ContentSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function ContentSection({ title, children }: ContentSectionProps) {
    return (
        <div className={isMobile ? "mobile-content-section" : "content-section"}>
            <div className="content-header">
                {title}
            </div>
            {children}
        </div>
    );
}
