import * as React from "react";

import { IconButton } from "../button";
import { IconSize, IconVariant } from "../icon";

interface ChipProps {
    label: string;
    remove(): void;
}

export default function Chip({ label, remove }: ChipProps) {
    return (
        <div className="chip">
            <span>{label}</span>
            <IconButton icon={IconVariant.CLOSE} onClick={remove} inline />
        </div>
    );
}
