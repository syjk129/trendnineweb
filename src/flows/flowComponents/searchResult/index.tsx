import * as React from "react";
import { withRouter } from "react-router-dom";

import Input, { InputVariant } from "../../../components/input";
import RouteProps from "../../routeProps";

import "./style.scss";

interface SearchResultProps extends RouteProps {
    value: string;
}

interface SearchResultState {
    value: string;
}

class SearchResult extends React.Component<SearchResultProps, SearchResultState> {
    state: SearchResultState = {
       value: this.props.value,
    };

    render() {
        return (
            <div className="search-result">
                <div className="search-label">
                    You searched for
                </div>
                <Input
                    value={this.state.value}
                    variant={InputVariant.UNDERLINE}
                    onChange={this._onChange}
                    onEnterPress={this._onSearch}
                />
            </div>
        );
    }

    private _onChange = (value: string) => {
        this.setState({ value });
    }

    private _onSearch = () => {
        const isShop = this.props.location.pathname.indexOf("/shop") > -1;

        this.props.history.push({
            pathname: isShop ? "/shop" : "/looks",
            search: `?keyword=${this.state.value}`,
            state: { refresh: true },
        });
    }
}

export default withRouter(SearchResult);
