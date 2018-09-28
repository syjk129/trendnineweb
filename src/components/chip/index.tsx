import * as React from "react";

import "./style.scss";

interface ChipProps {
    label: string;
    remove(): void;
}

export default function Chip({ label, remove }: ChipProps) {
    return (
        <div className="chip">
            <div className="chip-content">
                <span className="label">{label}</span>
                <span className="dismiss" onClick={remove}>&times;</span>
            </div>
        </div>
    );
}
