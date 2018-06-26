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
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { PostCard, ProductCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import CategoryTreeFilter from "../flowComponents/filter/filterComponents/categoryTreeFilter";
import MobileFilter from "../flowComponents/filter/mobileFilter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";
import ViewMore from "../flowComponents/viewMore";
import { Filters, PostParam } from "../model";
import { ShopDiscoverProps, ShopDiscoverState } from "./type";

interface MobileShopDiscoverState extends ShopDiscoverState {
    gridSize: number;
}

export default class MobileShopDiscover extends React.Component<ShopDiscoverProps, MobileShopDiscoverState> {
    static contextTypes: AppContext;

    state: MobileShopDiscoverState = {
        categories: [],
        products: [],
        nextToken: null,
        isLoading: true,
        loadingNext: false,
        productParam: null,
        gridSize: 1,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(nextProps: ShopDiscoverProps) {
        if (nextProps.location !== this.props.location) {
            this.setState({ isLoading: true });
            this.refreshContent(nextProps);
        }
    }

    async componentDidMount() {
        const categories = await this.props.getCategories();
        this.setState({
            categories: categories,
        });
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
            <div className="mobile-discover">
                {this.state.productParam.keyword !== "" && this.state.products.length < 1 && (
                    <div className="no-search-result-text">
                        No results for "{ this.state.productParam.keyword }"
                    </div>
                )}

                <MobileFilter setGridSize={this._setGridSize} />
                <CardContainer gridSize={this.state.gridSize} className={this.state.productParam.keyword === "" ? "" : "card-container-extra-space"}>
                    {this._renderProducts()}
                </CardContainer>
                {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextPosts} />}
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
        const productCards = products.map((product, index) => (
            <ProductCard
                product={product}
                gridSize={this.state.gridSize}
                isShop={true}
            />));

        return productCards;
    }

    @autobind
    private _setGridSize(gridSize: number) {
        this.setState({ gridSize });
    }
}
