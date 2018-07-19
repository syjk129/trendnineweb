import autobind from "autobind-decorator";
import * as React from "react";
import FadeIn from "react-lazyload-fadein";

import { Category } from "../../api/models";
import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { ProductCard } from "../flowComponents/cardView";
import Filter, { FilterTarget } from "../flowComponents/filter";
import Sort from "../flowComponents/sort";
import ViewMore from "../flowComponents/viewMore";
import { Filters, MenuCategory, MenuCategoryQueryMap, PostParam } from "../model";
import CategoryTree from "./category-tree";
import ShopCategoryTreeSidebar from "./shopCategorySidebar";
import { ShopDiscoverProps, ShopDiscoverState } from "./type";

interface DesktopShopDiscoverState extends ShopDiscoverState {
    selectedTree: CategoryTree;
}

export default class DesktopShopDiscover extends React.Component<ShopDiscoverProps, DesktopShopDiscoverState> {
    static contextTypes: AppContext;

    state: DesktopShopDiscoverState = {
        selectedTree: new CategoryTree(),
        categories: [],
        products: [],
        nextToken: null,
        isLoading: true,
        loadingNext: false,
        productParam: null,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(nextProps: ShopDiscoverProps) {
        if (nextProps.location !== this.props.location &&
            !nextProps.location.pathname.includes("share") && !nextProps.location.pathname.includes("login") && !nextProps.location.pathname.includes("onboarding")
        ) {
            if (nextProps.location.pathname !== this.props.location.pathname) {
                this.setState({ selectedTree: new CategoryTree() });
            }
            this.refreshContent(nextProps);
        }
    }

    async componentDidMount() {
        const categories = await this.props.getCategories();
        const selectedTree = this.state.selectedTree;
        const params = new URLSearchParams(this.props.location.search);
        const productParam = new PostParam(params);
        selectedTree.categories = categories;
        selectedTree.populateSelectedCategories(Array.from(productParam.filters.categoryIds));
        this.setState({ categories: categories, selectedTree });
    }

    async refreshContent(props: ShopDiscoverProps) {
        const params = new URLSearchParams(props.location.search);
        const productParam = new PostParam(params);
        this._categoryName = props.match.params.categoryName;

        let queryString = productParam.convertUrlParamToQueryString();
        if (this._categoryName && !Array.from(productParam.filters.categoryIds).find(categoryId => categoryId.length > 0)) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        queryString += `&page_size=10`;
        const products = location.pathname === "/shop/feed" ? await this.props.getFeedProducts() : await this.props.getLatestProducts(queryString);

        this.setState({
            products: products.list,
            nextToken: products.nextToken,
            productParam: productParam,
            isLoading: false,
        });

        this._staggerPopulateProducts(queryString, products.nextToken, this.props.location.pathname === "/feed", 0);
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className="shop">
                <Sidebar>
                    <div>
                        <ShopCategoryTreeSidebar
                            menuCategory={this._categoryName}
                            categoryList={this.state.categories}
                            selectedCategories={this.state.selectedTree.selectedCategories}
                            toggleCategory={this._toggleCategory}
                        />
                    </div>
                </Sidebar>
                <Content>
                    {this.state.productParam.keyword !== "" && (
                        <div className="search-text-container">
                            <div className="search-help">You searched for</div>
                            <div className="search-text">{this.state.productParam.keyword}</div>
                        </div>
                    )}
                    <Sticky id="filter-container" stickyClassName="sticky-filter-container">
                        <div className="filter-container">
                            <Filter
                                onApply={this._filterProducts}
                                filterTarget={FilterTarget.SHOP}
                                default={this.state.productParam.filters}
                                className={this.state.productParam.keyword !== "" && this.state.products.length < 1  ? "hide" : ""} />

                            <Sort
                                loggedIn={false}
                                name="Sort by"
                                default={this.state.productParam.sort}
                                onSelect={this._sortProduct}
                            />

                        </div>
                    </Sticky>
                    {this.state.productParam.keyword !== "" && this.state.products.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.productParam.keyword }"
                        </div>
                    )}

                    <CardContainer>
                        {this.state.products.map(product => (
                            <FadeIn height={540} duration={150}>
                                {onload => (
                                    <ProductCard
                                        onload={onload}
                                        product={product}
                                        isShop
                                    />
                                )}
                            </FadeIn>
                        ))}
                    </CardContainer>
                    {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextProducts} />}
                </Content>
            </div>
        );
    }

    private _categoryName: MenuCategory | null;

    private _staggerPopulateProducts = async (queryString: string, nextToken: string | null, isFeed: boolean, index: number) => {
        if (index < 4 && nextToken) {
            const products = isFeed ? await this.props.getFeedProducts(queryString, nextToken) : await this.props.getLatestProducts(queryString, nextToken);
            this.setState({
                products: this.state.products.concat(products.list),
                nextToken: products.nextToken,
            }, () => {
                this._staggerPopulateProducts(queryString, products.nextToken, isFeed, ++index);
            });
        }
    }

    @autobind
    private async _filterProducts(filters: Filters) {
        this.state.productParam.filters = filters;
        this._push(this.state.productParam);
    }

    @autobind
    private async _sortProduct(sortString: string) {
        this.state.productParam.sort = sortString;
        this._push(this.state.productParam);
    }

    @autobind
    private async _push(postParams: PostParam) {
        this.props.history.push({
            pathname: location.pathname,
            search: `?${postParams.convertToUrlParamString()}`,
        });
    }

    @autobind
    private async _paginateNextProducts() {
        if (!this.state.nextToken) {
            return;
        }
        this.setState({ loadingNext: true });

        let queryString = this.state.productParam.convertUrlParamToQueryString();
        if (this._categoryName && !Array.from(this.state.productParam.filters.categoryIds).find(categoryId => categoryId.length > 0)) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        const newProducts = await Promise.resolve(
            location.pathname === "/feed" ?
                this.props.getFeedProducts(queryString, this.state.nextToken)
                : this.props.getLatestProducts(queryString, this.state.nextToken));
        this.setState({
            products: this.state.products.concat(newProducts.list).filter((post, index, arr) => {
                return arr.map(mapProduct => mapProduct["id"]).indexOf(post["id"]) === index;
            }),
            nextToken: newProducts.nextToken,
            loadingNext: false,
        });
    }

    private _applyCategories = () => {
        let queryString = this.state.selectedTree.getQueryString();
        let pathname = this.props.location.pathname;
        if (queryString) {
            pathname += `?categories=${queryString}`;
        }
        this.props.history.push(pathname);
    }

    private _toggleCategory = (category: Category) => {
        const selectedTree = this.state.selectedTree;
        selectedTree.toggleCategory(category);
        this.setState({ selectedTree }, this._applyCategories);
    }
}
