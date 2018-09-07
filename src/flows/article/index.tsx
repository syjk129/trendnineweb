import { PropTypes } from "prop-types";
import * as React from "react";

import { Featured } from "../../api/models";
import { AppContext } from "../../app";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface ArticleState {
    article: Featured;
    isLoading: boolean;
}

export default class ArticleView extends React.Component<Props, ArticleState> {
    static contextTypes: AppContext;

    state: ArticleState = {
        article: null,
        isLoading: false,
    };

    async componentWillMount() {
        this._articleId = this.props.match.params.articleId;

        if (!this._articleId) {
            this.props.history.push("/");
        }

        this.setState({ isLoading: true });
        const article = await this.context.api.getFeaturedPost(this._articleId);
        this.setState({ article, isLoading: false });
    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (
            <div className="article">
                <div className="article-content" dangerouslySetInnerHTML={{__html: this.state.article.content}} />
            </div>
        );
    }

    private _articleId: string;
}

ArticleView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
