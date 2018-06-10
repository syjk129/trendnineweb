export enum FilterType {
    CATEGORY = "Category",
    BRANDS = "Brands",
    PRICE_RANGE = "Price Range",
    RETAILER = "Retailers",
    TAGS = "Tags",
}

export enum SortType {
}

export class SelectFilter {
    selectedIds: Array<string> = [];
}

export class RangeValueFilter {
    minValue: number;
    maxValue: number;
}

export type Filter = SelectFilter | RangeValueFilter;
