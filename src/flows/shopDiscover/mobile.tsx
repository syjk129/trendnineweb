import autobind from "autobind-decorator";
import * as React from "react";

import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { ProductCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import { ContentType, MenuCategory, MenuCategoryQueryMap, PostParam } from "../model";
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
        gridSize: 2,
    };

    componentWillMount() {
        this._pageRef = React.createRef();
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
        document.addEventListener("scroll", this._paginateNextProducts);
        document.addEventListener("touchmove", this._paginateNextProducts);

        const categories = await this.props.getCategories();
        this.setState({
            categories: categories,
        });
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._paginateNextProducts);
        document.removeEventListener("touchmove", this._paginateNextProducts);
    }

    async refreshContent(props: ShopDiscoverProps) {
        const params = new URLSearchParams(location.search);
        const productParam = new PostParam(params);
        this._categoryName = props.match.params.categoryName;

        let queryString = productParam.convertUrlParamToQueryString();
        if (this._categoryName && !Array.from(productParam.filters.categoryIds).find(categoryId => categoryId.length > 0)) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        queryString += "&page_size=18";

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
            <div className="mobile-discover" ref={this._pageRef}>
                {this.state.productParam.keyword !== "" && (
                    <div className="search-text-container">
                        <div className="search-help">You searched for</div>
                        <div className="search-text">{this.state.productParam.keyword}</div>
                    </div>
                )}
                {this.state.productParam.keyword !== "" && this.state.products.length < 1 && (
                    <div className="no-search-result-text">
                        No results for "{ this.state.productParam.keyword }"
                    </div>
                )}

                <ContentToolbar
                    location={this.props.location}
                    history={this.props.history}
                    match={this.props.match}
                    gridSize={this.state.gridSize}
                    loggedIn={!!user}
                    contentType={ContentType.PRODUCT}
                    setGridSize={this._setGridSize}
                />
                <CardContainer gridSize={this.state.gridSize}>
                    {this._renderProducts()}
                </CardContainer>
                {this.state.loadingNext && <Spinner />}
            </div>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _categoryName: MenuCategory | null;

    @autobind
    private async _paginateNextProducts() {
        if (!this.state.nextToken) {
            return;
        }

        // Infinite Scroll
        const page = this._pageRef.current;
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight + 100) {
            return;
        }

        this.setState({ loadingNext: true });

        let queryString = this.state.productParam.convertUrlParamToQueryString();
        if (this._categoryName && !Array.from(this.state.productParam.filters.categoryIds).find(categoryId => categoryId.length > 0)) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        queryString += "&page_size=18";
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
