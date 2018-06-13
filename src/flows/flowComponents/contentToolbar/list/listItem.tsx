import * as React from "react";

import Icon, { IconVariant } from "../../../../components/icon";

import "./style.scss";

interface ListItemProps {
    label: string;
    open?: boolean;
    onClick?(): void;
}

export default function ListItem ({ label, open, onClick }: ListItemProps) {
    return (
        <div className="list-item" onClick={onClick}>
            <span className="label">{label}</span>
            <div><Icon variant={open ? IconVariant.ARROW_LEFT : IconVariant.ARROW_RIGHT} /></div>
        </div>
    );
}
