import { PropTypes } from "prop-types";
import * as React from "react";
import FadeIn from "react-lazyload-fadein";

import { Product } from "../../api/models";
import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner from "../../components/spinner";
import { decodeCategoryUrl } from "../../util/urlUtil";
import ShopCard from "../flowComponents/cardView/shopCard";
import Refine from "../flowComponents/refine";
import { PostParam } from "../model";
import RouteProps from "../routeProps";

type Props = RouteProps;

interface ShopState {
    products: Array<Product>;
    nextToken: string | null;
    loadingContent: boolean;
    loadingNext: boolean;
}

export default class Shop extends React.Component<Props, ShopState> {
    static contextTypes: AppContext;

    state: ShopState = {
        products: [],
        nextToken: null,
        loadingContent: false,
        loadingNext: false,
    };

    async componentWillMount() {
        this._pageRef = React.createRef();
        if (!this.props.match.params) {
            // TODO: 404 handling?
            this.props.history.push("/");
            return;
        }

        document.addEventListener("scroll", this._populateNext);

        this._category = decodeCategoryUrl(this.props.match.params.category);
        this._subcategory = decodeCategoryUrl(this.props.match.params.subcategory);
        this.setState({ loadingContent: true });
        const products = await this._fetchContent(this.props);
        this.setState({
            products: products.list,
            nextToken: products.nextToken,
            loadingContent: false,
        });
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._populateNext);
    }

    async componentWillReceiveProps(nextProps: Props) {
        this._category = decodeCategoryUrl(nextProps.match.params.category);
        this._subcategory = decodeCategoryUrl(nextProps.match.params.subcategory);
        if (nextProps.location.state && nextProps.location.state.refresh && nextProps.location !== this.props.location) {
            this.setState({ loadingContent: true });
            const products = await this._fetchContent(nextProps);
            this.setState({
                products: products.list,
                nextToken: products.nextToken,
                loadingContent: false,
            });
        }
    }

    render() {
        return (
            <div className="shop" ref={this._pageRef}>
                <Sidebar>
                    <Refine onRefine={this._onRefine}/>
                </Sidebar>
                <Content>
                    {this.state.loadingContent ? (
                        <Spinner />
                    ) : (
                        <CardContainer>
                            {this.state.products.map(product => (
                                <FadeIn height={540} duration={150}>
                                    {onload => (
                                        <ShopCard onload={onload} product={product} clearData />
                                    )}
                                </FadeIn>
                            ))}
                        </CardContainer>
                    )}
                </Content>
            </div>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _pageSize = 12;
    private _category: string;
    private _subcategory: string;

    private _fetchContent = (props: Props, nextToken?: string) => {
        const params = new URLSearchParams(props.location.search);
        const postParam = new PostParam(params);
        if (postParam.filters.categoryIds.size === 0) {
            postParam.filters.categoryIds = new Set([this._subcategory || this._category]);
        }
        let queryString = postParam.convertUrlParamToQueryString();
        queryString += `&page_size=${this._pageSize}`;

        return this.context.api.getLatestProducts(queryString, nextToken);
    }

    private _populateNext = async () => {
        const page = this._pageRef.current;
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight || this.state.loadingNext || !this.state.nextToken) {
            return;
        }

        this.setState({ loadingNext: true });

        const products = await this._fetchContent(this.props, this.state.nextToken);
        this.setState({
            products: this.state.products.concat(products.list),
            nextToken: products.nextToken,
            loadingNext: false,
        });
    }

    private _onRefine = async (filterParam: PostParam) => {
        this.props.history.push(`${this.props.location.pathname}?${filterParam.convertToUrlParamString()}`);
        this.setState({ loadingContent: true });

        let queryString = `page_size=${this._pageSize}`;
        queryString += `&${filterParam.convertUrlParamToQueryString()}`;
        const products = await this.context.api.getLatestProducts(queryString);
        this.setState({
            products: products.list,
            nextToken: products.nextToken,
            loadingContent: false,
        });
    }
}

Shop.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
