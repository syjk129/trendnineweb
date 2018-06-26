import * as H from "history";
import { match } from "react-router-dom";

import { Category, Product, Products } from "../../api/models";
import { PostParam } from "../model";
import RouteProps from "../routeProps";

export interface ShopDiscoverProps extends RouteProps {
    getLatestProducts(queryString?: string, nextToken?: string): Products;
    getFeedProducts(queryString?: string, nextToken?: string): Products;
    getCategories(categoryId?: string): Array<Category>;
}

export interface ShopDiscoverState {
    categories: Array<Category>;
    products: Array<Product>;
    nextToken: string | null;
    isLoading: boolean;
    loadingNext: boolean;
    productParam: PostParam;
}
