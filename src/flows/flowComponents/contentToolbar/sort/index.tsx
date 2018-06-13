import * as React from "react";

import { ListContainer, ListItem } from "../list";

import { SortType } from "../types";

interface SortProps {
    sortTypes: Array<SortType>;
    currentSortType: SortType;
    selectSortType(sortType: SortType): void;
}

export default function Sort({ sortTypes, currentSortType, selectSortType}: SortProps) {
    return (
        <ListContainer>
            {sortTypes.map(sortOption => (
                <ListItem label={sortOption} onClick={() => selectSortType(sortOption)} />
            ))}
        </ListContainer>
    );
}
