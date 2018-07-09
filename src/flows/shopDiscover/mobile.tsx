import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { AppContext, AppContextTypes } from "../../app";
import Card, { CardContainer } from "../../components/card";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { PostCard, ProductCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import MobileFilter from "../flowComponents/filter/mobileFilter";
import ViewMore from "../flowComponents/viewMore";
import { ContentType, Filters, PostParam } from "../model";
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
        if (!this.state.isLoading && nextProps.location !== this.props.location &&
            !nextProps.location.pathname.includes("share") && !nextProps.location.pathname.includes("login") && !nextProps.location.pathname.includes("onboarding")
        ) {
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
        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <div className="mobile-discover">
                {this.state.productParam.keyword !== "" && this.state.products.length < 1 && (
                    <div className="no-search-result-text">
                        No results for "{ this.state.productParam.keyword }"
                    </div>
                )}

                <ContentToolbar
                    location={this.props.location}
                    history={this.props.history}
                    match={this.props.match}
                    loggedIn={!!user}
                    contentType={ContentType.PRODUCT}
                    setGridSize={this._setGridSize}
                />
                <CardContainer gridSize={this.state.gridSize} className={this.state.productParam.keyword === "" ? "" : "card-container-extra-space"}>
                    {this._renderProducts()}
                </CardContainer>
                {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextProducts} />}
            </div>
        );
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
