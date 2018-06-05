import * as React from "react";

import "./style.scss";

interface TabbedSectionProps {
    selected: any;
    sections: Array<any>;
    onSectionChange(section: any): void;
}

export default function TabbedSection({ selected, sections, onSectionChange }: TabbedSectionProps) {
    return (
        <div className="tabbed-section">
            {sections.map(section => (
                <div className="tab" onClick={() => onSectionChange(section)}>
                    <span className={selected === section ? "selected" : ""}>{section}</span>
                </div>
            ))}
        </div>
    );
}
