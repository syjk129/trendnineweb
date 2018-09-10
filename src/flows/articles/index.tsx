import { PropTypes } from "prop-types";
import * as React from "react";

import { Featured } from "../../api/models";
import { AppContext } from "../../app";
import { PostType } from "../cms/types";
import ArticleCard from "../flowComponents/cardView/articleCard";
import RouteProps from "../routeProps";

type Props = RouteProps;

interface ArticlesState {
    articles: Array<Featured>;
}

export default class Articles extends React.Component<Props, ArticlesState> {
    static contextTypes: AppContext;

    state: ArticlesState = {
        articles: [],
    };

    async componentWillMount() {
        const articles = await this.context.api.getFeaturedPosts(PostType.ARTICLE);
        this.setState({ articles });
    }

    render() {
        return (
            <div className="articles">
                <div className="article-list">
                    {this.state.articles.map(article => (
                        <ArticleCard article={article} />
                    ))}
                </div>
            </div>
        );
    }
}

Articles.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
