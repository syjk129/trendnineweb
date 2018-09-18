import { PropTypes } from "prop-types";
import * as React from "react";
import { isIOS } from "react-device-detect";

import { AppContext } from "../../";
import { IconButton } from "../../../components/button";
import { CardContainer } from "../../../components/card";
import { IconSize, IconVariant } from "../../../components/icon";
import Input, { InputType, InputVariant } from "../../../components/input";
import Spinner from "../../../components/spinner";
import Tab from "../../../components/tab";
import { LookCard, ShopCard } from "../../../flows/flowComponents/cardView";

import "./style.scss";

enum SearchTabs {
    LOOKS = "Looks",
    PRODUCTS = "Products",
    // INFLUENCERS = "Influencers",
}

interface SearchProps {
    search(): void;
}

interface SearchState {
    searchString: string;
    selectedTab: SearchTabs;
    searchResults: Array<any>;
    isLoading: boolean;
}

export default class Search extends React.Component<SearchProps, SearchState> {
    static contextTypes: AppContext;

    state: SearchState = {
        searchString: "",
        selectedTab: SearchTabs.LOOKS,
        searchResults: [],
        isLoading: false,
    };

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
        const { search } = this.props;

        return (
            <div className="mobile-search-container" ref={this._searchRef}>
                <div className="mobile-search">
                    <IconButton size={IconSize.MEDIUM} icon={IconVariant.SEARCH} onClick={search} />
                    <Input
                        className="search-input"
                        type={InputType.SEARCH}
                        value={this.state.searchString}
                        placeholder="Search"
                        variant={InputVariant.BLANK}
                        onChange={this._onSearchStringChange}
                        autofocus={!isIOS}
                    />
                </div>
                <div className="search-tabs">
                    {Object.keys(SearchTabs).map(key => (
                        <Tab
                            selected={this.state.selectedTab === SearchTabs[key]}
                            label={SearchTabs[key]}
                            onSelect={() => this._selectTab(SearchTabs[key])}
                        />
                    ))}
                </div>
                <div className="search-results">
                    {this.state.isLoading ? (
                        <Spinner />
                    ) : (
                        <CardContainer>
                            {this._renderSearchResult()}
                        </CardContainer>
                    )}
                </div>
            </div>
        );
    }

    private _searchRef: React.RefObject<HTMLDivElement>;
    private _inputTimer: any;

    private _selectTab = (tab: SearchTabs) => {
        this.setState({ selectedTab: tab, searchResults: [] }, () => this._onSearch(this.state.searchString));
    }

    private _renderSearchResult = () => {
        switch (this.state.selectedTab) {
            case SearchTabs.LOOKS:
                return this.state.searchResults.map(result => <LookCard look={result} />);
            case SearchTabs.PRODUCTS:
                return this.state.searchResults.map(result => <ShopCard product={result} />);
        }
    }

    private _onSearchStringChange = async (searchString: string) => {
        clearTimeout(this._inputTimer);
        this.setState({ searchString });
        this._inputTimer = setTimeout(() => this._onSearch(searchString), 400);
    }

    private _onSearch = async (searchString: string) => {
        let results;
        this.setState({ searchString });
        switch (this.state.selectedTab) {
            case SearchTabs.LOOKS:
                results = await this.context.api.getLatestPosts(`keyword=${searchString}&page_size=10`);
                break;
            case SearchTabs.PRODUCTS:
                results = await this.context.api.getLatestProducts(`keyword=${searchString}&page_size=10`);
                break;
        }
        this.setState({ searchResults: results.list, isLoading: false });
    }
}

Search.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
