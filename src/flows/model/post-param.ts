import { FilterConstants } from "../flowComponents/filter/filterComponents/types";
import { SortConstants } from "../flowComponents/sort/types";
import Filters from "./filters";

enum PostParamKey {
    KEYWORD = "keyword",
    SORT = "sort",
    PRICE_HIGH = "price_high",
    PRICE_LOW = "price_low",
    CATEGORIES = "categories",
    BRANDS = "brands",
    RETAILERS = "retailers",
    TAGS = "tags",
}

export default class PostParam {
    private static FILTER_SPLITTER = ",";

    keyword: string;
    sort: string;
    filters: Filters;

    constructor(urlParams: URLSearchParams) {
        this.keyword = this._parseStringFromParam(urlParams, PostParamKey.KEYWORD);
        this.sort = this._parseStringFromParam(urlParams, PostParamKey.SORT);

        this.filters = new Filters();
        this.filters.categoryIds = this._parseStringFromParam(urlParams, PostParamKey.CATEGORIES).split(PostParam.FILTER_SPLITTER);
        this.filters.brandIds = this._parseStringFromParam(urlParams, PostParamKey.BRANDS).split(PostParam.FILTER_SPLITTER);
        this.filters.retailerIds = this._parseStringFromParam(urlParams, PostParamKey.RETAILERS).split(PostParam.FILTER_SPLITTER);
        this.filters.tagIds = this._parseStringFromParam(urlParams, PostParamKey.TAGS).split(PostParam.FILTER_SPLITTER);
        this.filters.maxPrice = this._parseStringFromParam(urlParams, PostParamKey.PRICE_HIGH);
        this.filters.minPrice = this._parseStringFromParam(urlParams, PostParamKey.PRICE_LOW);
    }

    public convertToUrlParamString() {
        let urlParam = "";
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.KEYWORD, this.keyword);
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.SORT, this.sort);
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.CATEGORIES, this._convertFilterList(this.filters.categoryIds));
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.BRANDS, this._convertFilterList(this.filters.brandIds));
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.RETAILERS, this._convertFilterList(this.filters.retailerIds));
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.TAGS, this._convertFilterList(this.filters.tagIds));
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.PRICE_HIGH, this.filters.maxPrice ? this.filters.maxPrice : "");
        urlParam += this._appendQueryOrParam(urlParam, PostParamKey.PRICE_LOW, this.filters.minPrice ? this.filters.minPrice : "");
        return urlParam;
    }

    public convertUrlParamToQueryString() {
        let queryString = "";
        queryString += this._appendQueryOrParam(queryString, "keyword", this.keyword);
        queryString += this._appendQueryOrParam(queryString, SortConstants.SORT_PARAM_STRING, this.sort);
        queryString += this._appendQueryOrParam(queryString, FilterConstants.CATEGORY_PARAM_STRING, this._convertFilterList(this.filters.categoryIds));
        queryString += this._appendQueryOrParam(queryString, FilterConstants.BRAND_PARAM_STRING, this._convertFilterList(this.filters.brandIds));
        queryString += this._appendQueryOrParam(queryString, FilterConstants.RETAILER_PARAM_STRING, this._convertFilterList(this.filters.retailerIds));
        queryString += this._appendQueryOrParam(queryString, FilterConstants.TAG_PARAM_STRING, this._convertFilterList(this.filters.tagIds));
        queryString += this._appendQueryOrParam(queryString, FilterConstants.MAX_PRICE_PARAM_STRING, this.filters.maxPrice ? this.filters.maxPrice : "");
        queryString += this._appendQueryOrParam(queryString, FilterConstants.MIN_PRICE_PARAM_STRING, this.filters.minPrice ? this.filters.minPrice : "");
        return queryString;
    }

    private _convertFilterList(filters: Array<string>) {
        return filters ? filters.join(PostParam.FILTER_SPLITTER) : "";
    }

    private _parseStringFromParam(urlParams: URLSearchParams, key: string) {
        return urlParams.get(key) || "";
    }

    private _appendQueryOrParam(param: string, new_param_key: string, new_param_value: string) {
        if (new_param_value === "" || new_param_value === null) {
            return "";
        }

        let new_param = "";
        if (param !== "") {
            new_param = "&";
        }

        if (new_param_key === "") {
            new_param += new_param_value;
        } else {
            new_param += `${new_param_key}=${new_param_value}`;
        }
        return new_param;
    }
}
