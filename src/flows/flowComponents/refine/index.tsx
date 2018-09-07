import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { Brand, Category, PostTag, PostTagType, Retailer } from "../../../api/models";
import { AppContext } from "../../../app";
import { decodeCategoryUrl, encodeCategoryUrl } from "../../../util/urlUtil";
import { PostParam } from "../../model";
import RouteProps from "../../routeProps";
import { SortQueryParamMap, SortType } from "../contentToolbar/types";
import RefineItem from "./refineItem";
import RefineSection from "./refineSection";

import "./style.scss";

enum RefineContext {
    LOOKS = "looks",
    SHOP = "shop",
}

interface RefineProps extends RouteProps {
    onRefine(filterParam: PostParam): void;
}

interface RefineState {
    filterParam: PostParam;
    categories: Array<Category>;
    retailers: Array<Retailer>;
    brands: Array<Brand>;
    styles: Array<PostTag>;
    occasions: Array<PostTag>;
}

class Refine extends React.Component<RefineProps, RefineState> {
    static contextTypes: AppContext;

    state: RefineState = {
        filterParam: null,
        categories: [],
        retailers: [],
        brands: [],
        styles: [],
        occasions: [],
    };

    componentWillMount() {
        this._sortTypes = [
            SortType.LATEST,
            SortType.POPULARITY,
            SortType.PRICE_HIGH_TO_LOW,
            SortType.PRICE_LOW_TO_HIGH,
        ];
        this._category = decodeCategoryUrl(this.props.match.params.category);
        this._subcategory = decodeCategoryUrl(this.props.match.params.subcategory);
        const params = new URLSearchParams(location.search);
        const filterParam = new PostParam(params);
        this.setState({ filterParam, categories: this._category && this._subcategory ? null : [] });
        this._getCategories();
        this._getRetailers();
        this._getBrands();
        this._getStyles();
        this._getOccasions();
    }

    componentWillReceiveProps(nextProps: RefineProps) {
        this._category = decodeCategoryUrl(nextProps.match.params.category);
        this._subcategory = decodeCategoryUrl(nextProps.match.params.subcategory);
        if (nextProps.location.state && nextProps.location.state.refresh) {
            const params = new URLSearchParams(location.search);
            const filterParam = new PostParam(params);
            this.setState({ filterParam });
            this._getCategories();
            this._getRetailers();
            this._getBrands();
            this._getStyles();
            this._getOccasions();
        }
    }

    render() {
        return (
            <div className="refine">
                {/* <RefineSection name="Sort" isOpen>
                    {this._sortTypes.map(sort => (
                        <RefineItem
                            selected={this.state.filterParam.sort === SortQueryParamMap[sort]}
                            name={sort}
                            onSelect={() => this._toggleSort(sort)}
                        />
                    ))}
                </RefineSection> */}
                {this.state.categories && (
                    <RefineSection
                        name="Category"
                        isOpen={this.state.filterParam.filters.categoryIds.size > 0}
                    >
                        {this.state.categories.map(category => (
                            <RefineItem
                                selected={this.state.filterParam.filters.categoryIds.has(category.full_name)}
                                name={category.display_name}
                                isOpen={category.subcategories.some(s => this.state.filterParam.filters.categoryIds.has(s.full_name))}
                                onSelect={() => this._toggleCategory(category)}
                            >
                                {!this._category && category.subcategories.map(subcategory => (
                                    <RefineItem
                                        selected={this.state.filterParam.filters.categoryIds.has(subcategory.full_name)}
                                        name={subcategory.display_name}
                                        onSelect={() => this._toggleCategory(subcategory, category)}
                                    />
                                ))}
                            </RefineItem>
                        ))}
                    </RefineSection>
                )}
                <RefineSection name="Price">
                    Price
                </RefineSection>
                <RefineSection
                    name="Styles"
                >
                    {this.state.styles.map(style => (
                        <RefineItem
                            name={style.content}
                            selected={this.state.filterParam.filters.tagIds.has(style.content)}
                            onSelect={() => this._toggleTag(style)}
                        />
                    ))}
                </RefineSection>
                <RefineSection name="Occasions">
                    {this.state.occasions.map(occasion => (
                        <RefineItem
                            name={occasion.content}
                            selected={this.state.filterParam.filters.tagIds.has(occasion.content)}
                            onSelect={() => this._toggleTag(occasion)}
                        />
                    ))}
                </RefineSection>
                <RefineSection
                    name="Brand"
                    isOpen={this.state.filterParam.filters.brandIds.size > 0}
                >
                    {this.state.brands.map(brand => (
                        <RefineItem
                            name={brand.name}
                            selected={this.state.filterParam.filters.brandIds.has(brand.id)}
                            onSelect={() => this._toggleBrand(brand)}
                        />
                    ))}
                </RefineSection>
                <RefineSection
                    name="Retailer"
                    isOpen={this.state.filterParam.filters.retailerIds.size > 0}
                >
                    {this.state.retailers.map(retailer => (
                        <RefineItem
                            name={retailer.name}
                            selected={this.state.filterParam.filters.retailerIds.has(retailer.id)}
                            onSelect={() => this._toggleRetailer(retailer)}
                        />
                    ))}
                </RefineSection>
            </div>
        );
    }

    private _sortTypes: Array<SortType>;
    private _category: string;
    private _subcategory: string;

    private _getBrands = async () => {
        const brands = await this.context.api.getBrands();
        this.setState({ brands: brands.list });
    }

    private _getCategories = async () => {
        const categories = await this.context.api.getCategories();
        let subcategories;
        const womensCategories = categories.find(category => category.id === "70668ef0-7a13-41b1-8cda-c28b67e8098a");
        if (this._category) {
            const category = womensCategories.subcategories.find(category => category.full_name.toLowerCase() === this._category.toLowerCase());
            subcategories = this._subcategory ? null : category.subcategories;
        } else {
            subcategories = womensCategories.subcategories;
        }
        this.setState({ categories: subcategories });
    }

    private _getRetailers = async () => {
        const retailers = await this.context.api.getRetailers();
        this.setState({ retailers });
    }

    private _getStyles = async () => {
        const styles = await this.context.api.getPostTags(PostTagType.STYLE);
        this.setState({ styles });
    }

    private _getOccasions = async () => {
        const occasions = await this.context.api.getPostTags(PostTagType.OCCASION);
        this.setState({ occasions });
    }

    private _toggleCategory = (category: Category, parentCategory?: Category) => {
        let filterParam = this.state.filterParam;
        filterParam.filters.categoryIds = new Set([category.full_name]);
        if (parentCategory) {
            filterParam.parentCategory = parentCategory.full_name;
        }
        this.setState({ filterParam });
        this.props.onRefine(filterParam);
    }

    private _toggleSort = (sort: SortType) => {
        let filterParam = this.state.filterParam;
        filterParam.sort = SortQueryParamMap[sort];
        this.setState({ filterParam });
        this.props.onRefine(filterParam);
    }

    private _toggleTag = (tag: PostTag) => {
        let filterParam = this.state.filterParam;
        if (filterParam.filters.tagIds.has(tag.content)) {
            filterParam.filters.tagIds.delete(tag.content);
        } else {
            filterParam.filters.tagIds.add(tag.content);
        }
        this.setState({ filterParam });
        this.props.onRefine(filterParam);
    }

    private _toggleBrand = (brand: Brand) => {
        let filterParam = this.state.filterParam;
        if (filterParam.filters.brandIds.has(brand.id)) {
            filterParam.filters.brandIds.delete(brand.id);
        } else {
            filterParam.filters.brandIds.add(brand.id);
        }
        this.setState({ filterParam });
        this.props.onRefine(filterParam);
    }

    private _toggleRetailer = (retailer: Retailer) => {
        let filterParam = this.state.filterParam;
        if (filterParam.filters.retailerIds.has(retailer.id)) {
            filterParam.filters.retailerIds.delete(retailer.id);
        } else {
            filterParam.filters.retailerIds.add(retailer.id);
        }
        this.setState({ filterParam });
        this.props.onRefine(filterParam);
    }

    private _setSortType = (sortType: SortType) => {
    }
}

Refine.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(Refine);
