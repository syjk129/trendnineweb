export enum FilterType {
    CATEGORY = "Category",
    BRANDS = "Brands",
    PRICE_RANGE = "Price Range",
    RETAILER = "Retailers",
    TAGS = "Tags",
}

export enum SortType {
    RELEVANCE = "Relevance",
    LATEST = "Latest",
    POPULARITY = "Popularity",
    PRICE_HIGH_TO_LOW = "Price: High to Low",
    PRICE_LOW_TO_HIGH = "Price: Low to High",
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

export const SortQueryParamMap = {
    [SortType.RELEVANCE]: "",
    [SortType.LATEST]: "latest",
    [SortType.POPULARITY]: "popularity",
    [SortType.PRICE_HIGH_TO_LOW]: "price_desc",
    [SortType.PRICE_LOW_TO_HIGH]: "price_asc",
    "": SortType.RELEVANCE,
    "latest": SortType.LATEST,
    "popularity": SortType.POPULARITY,
    "price_desc": SortType.PRICE_HIGH_TO_LOW,
    "price_ac": SortType.PRICE_LOW_TO_HIGH,
};

export enum ToolbarType {
    SORT = "Sort",
    FILTER = "Filter",
}

export enum FilterCategory {
    SEARCH,
    RANGE,
    SELECT,
}

export class FilterOption {
    type: FilterType;
    category: FilterCategory;
}

export class SelectFilter {
    selectedIds: Array<string> = [];
}

export class RangeValueFilter {
    minValue: number;
    maxValue: number;
}

export class SortFilter {
    type: SortType;
}

export type Filter = SelectFilter | RangeValueFilter | SortFilter;
