export enum FilterType {
    CATEGORY = "Category",
    BRANDS = "Brands",
    PRICE_RANGE = "Price Range",
    RETAILER = "Retailers",
    TAGS = "Tags",
}

export const FilterQueryParamMap = {
    [FilterType.CATEGORY]: "categories",
    [FilterType.BRANDS]: "brand_ids",
    [FilterType.RETAILER]: "merchant_ids",
    [FilterType.TAGS]: "tags",
    "categories": [FilterType.CATEGORY],
    "brand_ids": [FilterType.BRANDS],
    "merchant_ids": [FilterType.RETAILER],
    "tags": [FilterType.TAGS],
};

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
