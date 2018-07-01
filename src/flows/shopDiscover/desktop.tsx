import autobind from "autobind-decorator";
import * as React from "react";

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
import { Filters, PostParam } from "../model";
import ShopCategoryTreeSidebar from "./shopCategorySidebar";
import { ShopDiscoverProps, ShopDiscoverState } from "./type";

interface DesktopShopDiscoverState extends ShopDiscoverState {
}

export default class DesktopShopDiscover extends React.Component<ShopDiscoverProps, DesktopShopDiscoverState> {
    static contextTypes: AppContext;

    state: DesktopShopDiscoverState = {
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
        if (nextProps.location.search !== this.props.location.search) {
            this.refreshContent(nextProps);
        }
    }

    async componentDidMount() {
        const categories = await this.props.getCategories();
        this.setState({ categories: categories });
    }

    async refreshContent(props: ShopDiscoverProps) {
        const params = new URLSearchParams(location.search);
        const productParam = new PostParam(params);
        const queryString = productParam.convertUrlParamToQueryString();

        const products = location.pathname === "/shop/feed" ? await this.props.getFeedProducts() : await this.props.getLatestProducts(queryString);

        this.setState({
            products: products.list,
            nextToken: products.nextToken,
            productParam: productParam,
            isLoading: false,
        });
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
                            categoryList={this.state.categories}
                            selectedCategories={this.props.selectedCategories}
                            toggleCategory={this.props.toggleCategory}
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
                            name="Sort by"
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
                        {this._renderProducts()}
                    </CardContainer>
                    {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextProducts} />}
                </Content>
            </div>
        );
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

        const queryString = this.state.productParam.convertUrlParamToQueryString();
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

    @autobind
    private _renderProducts() {
        const products = this.state.products;
        const productCards = products.map((post, index) => (
            <ProductCard
                product={post}
                isShop={true}
            />));

        return productCards;
    }
}
