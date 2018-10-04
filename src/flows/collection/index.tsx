import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { Featured, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { LookCard, ShopCard } from "../flowComponents/cardView";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface CollectionState {
    isLoading: boolean;
    collection: Featured;
    posts: Array<PostPreview>;
}

export default class Collection extends React.Component<Props, CollectionState> {
    static contextTypes: AppContext;

    state: CollectionState = {
        isLoading: false,
        posts: [],
        collection: null,
    };

    async componentWillMount() {
        this._collectionId = this.props.match.params.collectionId;
        this._bannerRef = React.createRef();
        this._placeholderRef = React.createRef();

        if (!this._collectionId) {
            this.props.history.push("/");
        }
        this.setState({ isLoading: true });
        const collection = await this.context.api.getFeaturedPost(this._collectionId);
        this.setState({ collection });
        const query = collection.direct_url ? collection.direct_url.split("?") : "";
        let posts;
        if (query && query.length > 1) {
            if (collection.direct_url.indexOf("shop") !== -1) {
                posts = await this.context.api.getLatestProducts(query[query.length - 1]);
                this._isShop = true;
            } else {
                posts = await this.context.api.getLatestPosts(query[query.length - 1]);
            }
            this.setState({ posts: posts.list });
        }
        this.setState({ isLoading: false });

        this._placeholderRef.current.style.height = `${this._bannerRef.current.getBoundingClientRect().height}px`;
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className={`collection${isMobile ? " mobile" : ""}`}>
                <div className="collection-banner" ref={this._bannerRef}>
                    <div className="collection-banner-content">
                        <h2>{this.state.collection.title}</h2>
                        <div className="collection-caption">{this.state.collection.caption}</div>
                    </div>
                </div>
                <div className="banner-placeholder" ref={this._placeholderRef} />
                <CardContainer gridSize={2}>
                    {this.state.posts.map(post => (
                        !this._isShop ? (
                            <LookCard onload={onload} look={post} />
                        ) : (
                            <ShopCard product={post} />
                        )
                    ))}
                </CardContainer>
            </div>
        );
    }

    private _isShop: boolean = false;
    private _collectionId: string;
    private _bannerRef: React.RefObject<HTMLDivElement>;
    private _placeholderRef: React.RefObject<HTMLDivElement>;
}

Collection.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
