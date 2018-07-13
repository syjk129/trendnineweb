import * as React from "react";
import { isIOS } from "react-device-detect";

import { IconButton } from "../../../components/button";
import { IconSize, IconVariant } from "../../../components/icon";
import Input, { InputVariant } from "../../../components/input";

import "./style.scss";

interface SearchProps {
    searchString: string;
    onSearchStringChange(searchString: string): void;
    search(): void;
}

export default class Search extends React.Component<SearchProps> {
    componentWillMount() {
        this._searchRef = React.createRef();
    }

    componentDidMount() {
        const searchEl = this._searchRef.current;
        const header = document.getElementById("header");

        if (searchEl && header) {
            if (isIOS) {
                searchEl.style.top = `${header.getBoundingClientRect().height}px`;
            } else {
                searchEl.style.top = `${header.offsetTop + header.getBoundingClientRect().height}px`;
            }
        }
    }

    render() {
        const { searchString, onSearchStringChange, search } = this.props;

        return (
            <div className="mobile-search-container" ref={this._searchRef}>
                <div className="mobile-search">
                    <Input
                        className="search-input"
                        value={searchString}
                        placeholder="Search"
                        variant={InputVariant.BLANK}
                        onChange={onSearchStringChange}
                        onEnterPress={search}
                        autofocus={!isIOS}
                    />
                    <IconButton size={IconSize.MEDIUM} icon={IconVariant.SEARCH} onClick={search} />
                </div>
            </div>
        );
    }

    private _searchRef: React.RefObject<HTMLDivElement>;
}
