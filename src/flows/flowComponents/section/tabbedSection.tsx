import * as React from "react";

import "./style.scss";

interface TabbedSectionProps {
    selected: any;
    sections: Array<any>;
    children?: React.ReactNode;
    showDots?: boolean;
    onSectionChange(section: any): void;
}

export default function TabbedSection({ selected, showDots, sections, children, onSectionChange }: TabbedSectionProps) {
    return (
        <>
            <div className="tabbed-section">
                {sections.map(section => (
                    <div className="tab" onClick={() => onSectionChange(section)}>
                        <span className={selected === section ? "tab-name selected" : "tab-name"}>{section}</span>
                    </div>
                ))}
            </div>
            {children}
            {sections.length > 1 && showDots && (
                <div className="tab-dots">
                    {sections.map(section => (
                        <div
                            className={`section-dot ${selected === section ? "selected" : ""}`}
                            onClick={() => onSectionChange(section)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
