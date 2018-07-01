import { Category, Product, Products } from "../../api/models";
import { PostParam } from "../model";
import RouteProps from "../routeProps";

export interface ShopDiscoverProps extends RouteProps {
    selectedCategories: Array<string>;
    getLatestProducts(queryString?: string, nextToken?: string): Products;
    getFeedProducts(queryString?: string, nextToken?: string): Products;
    getCategories(categoryId?: string): Array<Category>;
    toggleCategory(category: Category): void;
}

export interface ShopDiscoverState {
    categories: Array<Category>;
    products: Array<Product>;
    nextToken: string | null;
    isLoading: boolean;
    loadingNext: boolean;
    productParam: PostParam;
}
