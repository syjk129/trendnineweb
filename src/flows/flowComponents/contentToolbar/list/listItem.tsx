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

export default function ListItem ({ label, back, value, checked, open, onSelect, onClick }: ListItemProps) {
    return (
        <div className="list-item">
            {checked !== undefined && onSelect && (
                <Checkbox value={value} checked={checked} onChange={onSelect} />
            )}
            {back ? (
                <span className="list-label-back" onClick={onClick}>
                    <div className="back-button"><Icon variant={open ? IconVariant.ARROW_LEFT : IconVariant.ARROW_RIGHT} /></div>
                    <span className="label">{label}</span>
                </span>
            ) : (
                <span className="list-label" onClick={onClick}>
                    <span className="label">{label}</span>
                    <div><Icon variant={open ? IconVariant.ARROW_LEFT : IconVariant.ARROW_RIGHT} /></div>
                </span>
            )}
        </div>
    );
}
