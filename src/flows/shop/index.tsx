
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Featured } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Content from "../../components/content";
import Spinner, { SpinnerContainer } from "../../components/spinner";

import "./style.scss";

interface ShopProps {
    location: any;
    match: match<any>;
}

interface ShopState {
    featured: Array<Featured>;
    isLoading: boolean;
}

export default class Shop extends React.Component<ShopProps, ShopState> {
    static contextTypes: AppContext;

    state: ShopState = {
        featured: [],
        isLoading: false,
    };

    componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: ShopProps) {
        this.setState({ isLoading: true });
        this.refreshContent(props);
    }

    async refreshContent(props: ShopProps) {
        const [
            featured,
        ] = await Promise.all([
            this.context.api.getFeatured(""),
        ]);

        this.setState({
            featured: featured,
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
};
