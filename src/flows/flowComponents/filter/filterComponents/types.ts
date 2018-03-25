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
