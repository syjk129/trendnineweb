import * as React from "react";

import { IconButton, LinkButton } from "../../../components/button";
import { IconVariant } from "../../../components/icon";

interface FilterNavigationProps {
    title: string;
    children: React.ReactNode;
    onClose(): void;
    onBack?(): void;
    clearFilter?(): void;
}

export default function FilterNavigation({ title, children, onBack, onClose, clearFilter }: FilterNavigationProps) {
    return (
        <div className="filter-navigation">
            <div className="filter-navigation-header">
                {onBack ? (
                    <IconButton icon={IconVariant.ARROW_LEFT} onClick={onBack} />
                ) : (
                    <span className="close" onClick={onClose}>&times;</span>
                )}
                <div className="filter-navigation-title">
                    {title}
                </div>
                {clearFilter && (
                    <LinkButton className="clear-filter" onClick={clearFilter}>Clear filters</LinkButton>
                )}
            </div>
            {children}
        </div>
    );
}
