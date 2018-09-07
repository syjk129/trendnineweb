import * as React from "React";

interface HomeSectionProps {
    title: string;
    subtitle: string;
    cta?: React.ReactNode;
    children: React.ReactNode;
}

export default function HomeSection({ title, subtitle, cta, children}: HomeSectionProps) {
    return (
        <div className="home-section">
            <div className="home-section-header">
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
