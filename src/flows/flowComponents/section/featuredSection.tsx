import * as React from "react";

interface FeaturedSectionProps {
    title: string;
    subtitle: string;
    cta?: React.ReactNode;
    children: React.ReactNode;
}

export default function FeaturedSection({ title, subtitle, cta, children}: FeaturedSectionProps) {
    return (
        <div className="featured-section">
            <div className="featured-section-header">
                <div className="header-text">
                    <h2 className="header-title">{title}</h2>
                    {subtitle}
                </div>
                {cta}
            </div>
            {children}
        </div>
    );
}
