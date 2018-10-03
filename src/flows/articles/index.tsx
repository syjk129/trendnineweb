import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

import { Featured } from "../../api/models";
import { AppContext } from "../../app";
import Button from "../../components/button";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostType } from "../cms/types";
import { ArticleCard, FeaturedCard } from "../flowComponents/cardView";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface ArticlesState {
    articles: Array<Featured>;
    isLoading: boolean;
    shouldReset: boolean;
}

export default class Articles extends React.Component<Props, ArticlesState> {
    static contextTypes: AppContext;

    state: ArticlesState = {
        articles: [],
        isLoading: false,
        shouldReset: false,
    };

    async componentWillMount() {
        this._articlesRef = React.createRef();
        this._mainRightRef = React.createRef();
        this._mainLeft1Ref = React.createRef();
        this._mainLeft2Ref = React.createRef();
        window.addEventListener("resize", this._setFeaturedSize);

        this.setState({ isLoading: true });
        try {
            const articles = await this.context.api.getFeaturedPosts(PostType.ARTICLE);
            this.setState({ articles, isLoading: false, shouldReset: true });
        } catch (err) {
            console.warn(err);
        }
    }

    componentDidMount() {
        this._setFeaturedSize();
    }

    componentDidUpdate() {
        if (this.state.shouldReset) {
            this._setFeaturedSize();
            this.setState({ shouldReset: false });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._setFeaturedSize);
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className="articles" ref={this._articlesRef}>
                {!isMobile && (
                    <div className="featured-articles">
                        <div className="featured-articles-left">
                            <div className="item" ref={this._mainLeft1Ref}>
                                <FeaturedCard post={this.state.articles[1]} />
                            </div>
                            <div className="item" ref={this._mainLeft2Ref}>
                                <FeaturedCard post={this.state.articles[2]} />
                            </div>
                        </div>
                        <div className="featured-articles-right">
                            <div className="item" ref={this._mainRightRef}>
                                <FeaturedCard post={this.state.articles[0]} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="article-list">
                    {this.state.articles.map(article => (
                        <ArticleCard article={article} />
                    ))}
                </div>
            </div>
        );
    }

    private _mainLeft1Ref: React.RefObject<HTMLDivElement>;
    private _mainLeft2Ref: React.RefObject<HTMLDivElement>;
    private _mainRightRef: React.RefObject<HTMLDivElement>;
    private _articlesRef: React.RefObject<HTMLDivElement>;

    private _setFeaturedSize = () => {
        if (this._mainRightRef.current && this._mainLeft1Ref.current && this._mainLeft2Ref.current) {
            const heightRatio = 3;
            const widthRatio = 4;
            const featuredSpacing = 30;
            const screenWidth = this._articlesRef.current.getBoundingClientRect().width;

            const smallSize = (screenWidth - featuredSpacing - (widthRatio * featuredSpacing / heightRatio)) / (3 * widthRatio);
            const bigSize = (featuredSpacing / heightRatio) + smallSize * 2;

            this._mainRightRef.current.style.width = `${bigSize * widthRatio}px`;
            this._mainRightRef.current.style.height = `${bigSize * heightRatio}px`;
            this._mainLeft1Ref.current.style.width = `${smallSize * widthRatio}px`;
            this._mainLeft1Ref.current.style.height = `${smallSize * heightRatio}px`;
            this._mainLeft2Ref.current.style.width = `${smallSize * widthRatio}px`;
            this._mainLeft2Ref.current.style.height = `${smallSize * heightRatio}px`;
        }
    }

    private _getFeaturedAtLevel = (level: number) => {
        return this.state.articles.find(featured => featured.priority_level === level);
    }
}

Articles.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
