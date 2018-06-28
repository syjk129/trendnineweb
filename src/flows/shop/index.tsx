
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Featured } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Content from "../../components/content";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface ShopState {
    featured: Array<Featured>;
    isLoading: boolean;
}

export default class Shop extends React.Component<Props, ShopState> {
    static contextTypes: AppContext;

    state: ShopState = {
        featured: [],
        isLoading: true,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    async refreshContent(props: Props) {
        const [
            featured,
        ] = await Promise.all([
            this.context.api.getFeatured(""),
        ]);

        this.setState({
            featured,
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className="shop">
                <Content>
                    {this._renderFeatured()}
                </Content>
            </div>
        );
    }

    @autobind
    private _renderFeatured() {
        const featured = this.state.featured;
        return featured.map((f, index) => (
            <div>
                {f.content}
            </div>
        ));
    }
}

Shop.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
