export interface SearchFilterProps {
    searchValue: string;
    placeholder?: string;
    onSearch(value: string): void;
}

export class FilterConstants {
    static CATEGORY = "CATEGORY";
    static BRAND = "BRAND";
    static PRICE_RANGE = "PRICE RANGE";
    static ON_SALE = "ON SALE";
    static NEW_ARRIVALS = "NEW ARRIVALS";
    static RETAILER = "RETAILER";
    static TAG = "TAG";

    static CATEGORY_PARAM_STRING = "categories";
    static BRAND_PARAM_STRING = "brands";
    static MAX_PRICE_PARAM_STRING = "max_price";
    static MIN_PRICE_PARAM_STRING = "min_price";
    static ON_SALE_PARAM_STRING = "isOnSale";
    static NEW_ARRIVALS_PARAM_STRING = "isNewArrivals";
    static RETAILER_PARAM_STRING = "retailers";
    static TAG_PARAM_STRING = "tags";

    static FILTER_LIST = [
        FilterConstants.CATEGORY,
        FilterConstants.BRAND,
        FilterConstants.PRICE_RANGE,
        FilterConstants.ON_SALE,
        FilterConstants.NEW_ARRIVALS,
        FilterConstants.RETAILER,
        FilterConstants.TAG,
    ];
}
