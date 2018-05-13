
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Product } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import { LinkButton } from "../../components/button";
import Card, { CardContainer } from "../../components/card";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { PostCard, ProductCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";

interface ShopDiscoverProps {
    location: any;
    match: match<any>;
}

interface ShopDiscoverState {
    products: Array<Product>;
    productsNextToken: string;
    keyword: string;
    search: string;
    filter: string;
    sort: string;
    isLoading: boolean;
    numCardsPerRow: number;
}

export default class ShopDiscover extends React.Component<ShopDiscoverProps, ShopDiscoverState> {
    static contextTypes: AppContext;

    state: ShopDiscoverState = {
        products: [],
        productsNextToken: "",
        keyword: "",
        search: "",
        filter: "",
        sort: "",
        isLoading: false,
        numCardsPerRow: 2,
    };

    componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: ShopDiscoverProps) {
        this.setState({ isLoading: true });
        this.refreshContent(props);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    async refreshContent(props: ShopDiscoverProps) {
        const queryString = location.search;
        const keyword = new URLSearchParams(queryString).get("q") || "";
        const searchQuery = keyword ? `keyword=${keyword}` : "";

        const [
            products,
        ] = await Promise.all([
            location.pathname === "/shop/feed" ? this.context.api.getFeedProducts() : this.context.api.getLatestProducts(searchQuery),
        ]);

        this.setState({
            products: products.list,
            productsNextToken: products.nextToken,
            keyword: keyword,
            search: searchQuery,
            filter: "",
            sort: "",
            isLoading: false,
        });
    }

    onScroll = () => {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom) {
            this._paginateNextPosts();
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
                    <div className="filter-container">
                        {/* <Filter
                            onApply={this._filterPosts}
                            filterTarget={FilterTarget.POST}
                            className={this.state.keyword !== "" && this.state.products.length < 1  ? "hide" : ""} /> */}
                        {/* <Sort
                        name="Sort by"
                        onSelect={this._sortPosts}
                        /> */}
                    </div>
                </Sidebar>
                <Content>
                    {this.state.keyword !== "" && this.state.products.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.keyword }"
                        </div>
                    )}

                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderProducts()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    @autobind
    private async _filterPosts(filterString: string) {
        this.setState({
            filter: filterString,
            productsNextToken: "",
        }, this._updateProducts);
    }

    @autobind
    private async _sortPosts(sortString: string) {
        this.setState({
            sort: sortString,
            productsNextToken: "",
        }, this._updateProducts);
    }

    @autobind
    private async _getProducts() {
        let query = "";

        if (this.state.sort) {
            query = `${this.state.sort}`;
        }

        if (this.state.filter) {
            query += `&${this.state.filter}`;
        }

        if (this.state.keyword) {
            query += `&${this.state.search}`;
        }

        return location.pathname === "/shop/feed" ? this.context.api.getFeedProducts() : this.context.api.getLatestProducts(query, this.state.productsNextToken);
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.productsNextToken == null) {
            return;
        }

        const newProducts = await this._getProducts();
        this.setState({
            products: this.state.products.concat(newProducts.list).filter((product, index, arr) => {
                return arr.map(mapProduct => mapProduct["id"]).indexOf(product["id"]) === index;
            }),
            productsNextToken: newProducts.nextToken,
        });
    }

    @autobind
    private async _updateProducts() {
        const newProducts = await this._getProducts();

        this.setState({
            products: newProducts.list,
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

ShopDiscover.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
