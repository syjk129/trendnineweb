import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Category, Product } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import { LinkButton } from "../../components/button";
import Card, { CardContainer } from "../../components/card";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import { PostCard, ProductCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";
import { Filters, PostParam } from "../model";
import ShopCategoryTreeSidebar from "./shopCategorySidebar";
import { ShopDiscoverProps, ShopDiscoverState } from "./type";

interface DesktopShopDiscoverState extends ShopDiscoverState {
    numCardsPerRow: number;
}

export default class DesktopShopDiscover extends React.Component<ShopDiscoverProps, DesktopShopDiscoverState> {
    static contextTypes: AppContext;

    state: ShopDiscoverState = {
        categories: [],
        products: [],
        productsNextToken: "",
        isLoading: false,
        numCardsPerRow: 2,
        productParam: null,
    };

    async componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: ShopDiscoverProps) {
        this.setState({ isLoading: true });
        this.refreshContent(props);
    }

    async componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);

        try {
            const categories = await this.props.getCategories();
            this.setState({
                categories: categories[1].subcategories,
            });
        } catch (err) {
            console.warn(err);
        }
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    async refreshContent(props: ShopDiscoverProps) {
        const params = new URLSearchParams(location.search);
        const productParam = new PostParam(params);
        const queryString = productParam.convertUrlParamToQueryString();

        const [
            products,
        ] = await Promise.all([
            location.pathname === "/shop/feed" ? this.props.getFeedProducts() : this.props.getLatestProducts(queryString),
        ]);

        this.setState({
            products: products.list,
            productsNextToken: products.nextToken,
            productParam: productParam,
            isLoading: false,
        });
    }

    onScroll = () => {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom) {
            this._paginateNextProducts();
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="discover">
                    <Content>
                        <br /><br /><br />Loading...
                    </Content>
                </div>
            );
        }

        return (
            <div className="shop">
                <Sidebar>
                    <div>
                        <ShopCategoryTreeSidebar
                            categoryList={this.state.categories} />
                    </div>
                </Sidebar>
                <Content>
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

                    <CardContainer className={this.state.productParam.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderProducts()}
                    </CardContainer>
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
        if (this.state.productsNextToken == null) {
            return;
        }

        const queryString = this.state.productParam.convertUrlParamToQueryString();
        const newProducts = await Promise.resolve(
            location.pathname === "/feed" ?
                this.props.getFeedProducts(queryString, this.state.productsNextToken)
                : this.props.getLatestProducts(queryString, this.state.productsNextToken));
        this.setState({
            products: this.state.products.concat(newProducts.list).filter((post, index, arr) => {
                return arr.map(mapProduct => mapProduct["id"]).indexOf(post["id"]) === index;
            }),
            productsNextToken: newProducts.nextToken,
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
