import { Category } from "../../../api/models";

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
    "categories": FilterType.CATEGORY,
    "brand_ids": FilterType.BRANDS,
    "merchant_ids": FilterType.RETAILER,
    "tags": FilterType.TAGS,
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
    TREE_SELECT,
}

export class FilterOption {
    type: FilterType;
    category: FilterCategory;
}

export class SelectFilter {
    isSelectFilter: boolean = true;

    selectedIds: Array<string> = [];
}

export class RangeValueFilter {
    isRangeValueFilter: boolean = true;

    minValue: number = null;
    maxValue: number = null;
}

export class SortFilter {
    type: SortType;
}

export class TreeSelectFilter {
    isTreeSelectFilter: boolean = true;

    selectedTree: Array<string> = [];
}

export type Filter = SelectFilter | RangeValueFilter | SortFilter | TreeSelectFilter;

export function isSelectFilter(filter: any): filter is SelectFilter {
    return filter.isSelectFilter;
}

export function isRangeValueFilter(filter: any): filter is RangeValueFilter {
    return filter.isRangeValueFilter;
}

export function isTreeSelectFilter(filter: any): filter is TreeSelectFilter {
    return filter.isTreeSelectFilter;
}
