import Sort from ".";

export class SortConstants {
    static RELEVANCE = "Relevance";
    static LATEST = "Latest";
    static POPULARITY = "Popularity";
    static PRICE_HIGH_TO_LOW = "Price: High to Low";
    static PRICE_LOW_TO_HIGH = "Price: Low to High";
    static SORT_LIST = [
        SortConstants.RELEVANCE,
        SortConstants.LATEST,
        SortConstants.POPULARITY,
        SortConstants.PRICE_HIGH_TO_LOW,
        SortConstants.PRICE_LOW_TO_HIGH,
    ];

    static SORT_PARAM_STRING = "order_by";
    static RELEVANCE_ID = "relevance";
    static LATEST_ID = "latest";
    static POPULARITY_ID = "popularity";
    static PRICE_HIGH_TO_LOW_ID = "price_desc";
    static PRICE_LOW_TO_HIGH_ID = "price_asc";
}
