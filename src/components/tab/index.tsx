import * as React from "react";

import "./style.scss";

interface TabProps {
    selected: boolean;
    label: string;
    onSelect(): void;
}

export default function Tab({ selected, label, onSelect}: TabProps) {
    let classes = "tab";
    if (selected) {
        classes += " selected";
    }

    return (
        <div className={classes} onClick={onSelect}>
            {label}
        </div>
    );
}
