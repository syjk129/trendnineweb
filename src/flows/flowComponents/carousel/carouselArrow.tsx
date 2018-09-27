import * as React from "react";

import Icon, { IconVariant } from "../../../components/icon";

interface CarouselArrowProps {
    icon: IconVariant;
    className?: string;
    onClick?(): void;
}

export default function CarouselArrow({ icon, className, onClick }: CarouselArrowProps) {
    let classes = "carousel-arrow";
    if (className) {
        classes += ` ${className}`;
    }

    return (
        <div className={classes} onClick={onClick}>
            <Icon variant={icon} />
        </div>
    );
}
