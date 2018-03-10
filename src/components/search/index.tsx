import * as React from "react";
import { withRouter } from "react-router-dom";
import autobind from "autobind-decorator";
import Icon, { IconVariant } from "../icon";

import "./style.scss";

interface SearchProps {
    placeholder?: string;
}

interface SearchState {
    value: string;
}


class Search extends React.Component<SearchProps, SearchState> {
    state: SearchState = {
        value: "",
    };

    render() {
        return (
            <div className="search-container">
                <Icon variant={IconVariant.SEARCH}></Icon>
                <input className="search-input" type="text" value={this.state.value} placeholder={this.props.placeholder} onChange={this._onChange}></input>
            </div>
        );
    }

    @autobind
    private _onChange(event) {
        event.preventDefault();
        this.setState({value: event.target.value });
    }
}

export default withRouter(Search);
