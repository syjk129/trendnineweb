import * as React from "react";

import Checkbox from "../../../../components/checkbox";
import Icon, { IconVariant } from "../../../../components/icon";

import "./style.scss";

interface ListItemProps {
    label: string;
    back?: boolean;
    value?: string;
    checked?: boolean;
    open?: boolean;
    onSelect?(): void;
    onClick?(): void;
}

export default function ListItem ({ label, value, checked, open, onSelect, onClick }: ListItemProps) {
    const showCheckbox = checked !== undefined && onSelect;
    return (
        <div className={showCheckbox ? "list-item" : "list-item main"}>
            {showCheckbox && (
                <Checkbox value={value} checked={checked} onChange={onSelect} />
            )}
            <span className="list-label" onClick={onClick}>
                <span className="label">{label}</span>
                {onClick && (
                    <div><Icon variant={open ? IconVariant.ARROW_LEFT : IconVariant.ARROW_RIGHT} /></div>
                )}
            </span>
        </div>
    );
}
