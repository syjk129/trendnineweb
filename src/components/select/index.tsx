import * as React from "react";

import "./style.scss";

interface SelectProps {
    value: string;
    children: React.ReactNode;
    onChange(value: string): void;
}

export default function Select({ value, children, onChange }: SelectProps) {
    const handleChange = (event) => {
        event.preventDefault();
        onChange(event.target.value);
    };

    return (
        <select className="select" value={value} onChange={handleChange}>
            {children}
        </select>
    );
}
