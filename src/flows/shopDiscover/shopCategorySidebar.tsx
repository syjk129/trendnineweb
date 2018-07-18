import autobind from "autobind-decorator";
import * as React from "react";

import { Category } from "../../api/models";
import { IconButton, LinkButton } from "../../components/button";
import Checkbox from "../../components/checkbox";
import { IconVariant } from "../../components/icon";
import { MenuCategory, MenuCategoryQueryMap } from "../model";
import { findCategory } from "./category-tree";

import "./style.scss";

interface ShopCategoryTreeSidebarProps {
    menuCategory: MenuCategory;
    categoryList: Array<Category>;
    selectedCategory?: string;
    selectedCategories: Set<string>;
    toggleCategory(category: Category): void;
 }

interface ShopCategoryTreeSidebarState {
    expandedParents: Map<number, Category>;
}

export default class ShopCategoryTreeSidebar extends React.Component<ShopCategoryTreeSidebarProps, ShopCategoryTreeSidebarState> {
    state: ShopCategoryTreeSidebarState = {
        expandedParents: new Map(),
    };

    componentWillMount() {
        const expandedParents = new Map<number, Category>();
        expandedParents[0] = null;
        expandedParents[1] = null;

        this.setState({ expandedParents });
    }

    render() {
        const categories = this.props.categoryList;
        if (!categories || categories.length < 1) {
            return null;
        }

        let category = this.props.categoryList.find(category => category.id === "70668ef0-7a13-41b1-8cda-c28b67e8098a");
        if (this.props.menuCategory) {
            category = findCategory(MenuCategoryQueryMap[this.props.menuCategory], this.props.categoryList);
        }
        const prevPage = this.props.menuCategory ? MenuCategoryQueryMap[MenuCategory.WOMENS_FASHION] : null;
        const prevPageUrl = "/shop/discover";

        return (
            <div className="category-sidebar-container">
                {prevPage && (
                    <div className="navigation">
                        <LinkButton to={prevPageUrl}>
                            {prevPage}
                        </LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;{category.display_name}
                    </div>
                )}
                <div className="category-header">
                    {category.display_name}
                </div>
                {this._renderCategories(category.subcategories, 0)}
            </div>
        );
    }

    @autobind
    private _renderCategories(categories: Array<Category>, level: number) {
        let classes = "tree-item";
        if (level === 0) {
            classes += " head";
        }

        return (
            <div className={classes}>
                {categories.map(category => (
                    <div className="category-container">
                        <div className="category">
                            <Checkbox
                                value={category.id}
                                checked={this.props.selectedCategories.has(category.full_name)}
                                onChange={() => this.props.toggleCategory(category)}
                            />
                            <LinkButton
                                className="category-name"
                                onClick={() => this._handleCategoryNameClick(level, category)}
                            >
                                {category.display_name}
                            </LinkButton>
                            {this._renderCollapseButton(level, category, category.subcategories && category.subcategories.length > 0)}
                        </div>
                        {this.state.expandedParents[level] === category && (
                            <div className="subcategories">
                                {this._renderCategories(category.subcategories, level + 1)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    private _handleCategoryNameClick = (level: number, category: Category) => {
        if (category.subcategories.length > 0) {
            return this._onExpand(level, category);
        }
        return this.props.toggleCategory(category);
    }

    @autobind
    private _renderCollapseButton(level: number, category: Category, hasSubCategory: boolean) {
        if (!hasSubCategory) {
            return null;
        }

        return (
            <IconButton
                noSwitch
                className="category-collapse"
                icon={IconVariant.ARROW_DOWN}
                selected={this.state.expandedParents[level] === category}
                onClick={() => this._onExpand(level, category)}
            />
        );
    }

    @autobind
    private _onExpand(level: number, category: Category) {
        let expandedParents = this.state.expandedParents;
        if (expandedParents[level] === category) {
            expandedParents[level] = null;
            expandedParents[level + 1] = null;
        } else {
            expandedParents[level] = category;
            expandedParents[level + 1] = null;
        }
        this.setState({expandedParents: expandedParents});
    }
}
