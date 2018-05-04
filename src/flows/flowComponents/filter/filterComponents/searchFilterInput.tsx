import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";
import { withRouter } from "react-router-dom";

import Icon, { IconVariant } from "../../../../components/icon";
import Input, { InputType } from "../../../../components/input";
import { SearchFilterProps } from "./types";

import "./style.scss";

interface SearchFilterInputProps extends SearchFilterProps {}

class SearchFilterInput extends React.Component<SearchFilterInputProps, never> {
    render() {
        return (
            <div className="search-filter-input-container">
                <Icon variant={IconVariant.SEARCH}></Icon>
                <Input className="search-filter-input" placeholder={this.props.placeholder} type={InputType.TEXT} value={this.props.searchValue} onChange={this._onSearch} />
            </div>
        );
    }

    @autobind
    private _onSearch(value: string) {
        if (typeof this.props.onSearch === "function") {
            this.props.onSearch(value);
        }
    }
}

export default withRouter(SearchFilterInput);
