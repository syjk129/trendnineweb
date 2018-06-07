import * as H from "history";
import { match } from "react-router-dom";

import { Category, Product, Products } from "../../api/models";
import { PostParam } from "../model";

export interface ShopDiscoverProps {
    history: H.History;
    location: any;
    match: match<any>;
    getLatestProducts(queryString?: string, nextToken?: string): Products;
    getFeedProducts(queryString?: string, nextToken?: string): Products;
    getCategories(categoryId?: string): Array<Category>;
}

export interface ShopDiscoverState {
    categories: Array<Category>;
    products: Array<Product>;
    productsNextToken: string;
    isLoading: boolean;
    productParam: PostParam;
}
