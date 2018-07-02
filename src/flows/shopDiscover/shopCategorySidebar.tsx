import autobind from "autobind-decorator";
import * as React from "react";

import { Category } from "../../api/models";
import Button, { ButtonVariant, IconButton, LinkButton } from "../../components/button";
import Checkbox from "../../components/checkbox";
import Icon, { IconVariant } from "../../components/icon";

import "./style.scss";

interface ShopCategoryTreeSidebarProps {
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
        return (
            <div>
                { this._renderCategoryTree(this.props.categoryList) }
            </div>
        );
    }

    @autobind
    private _renderCategoryTree(categories: Array<Category>) {
        if (!categories || categories.length < 1) {
            return;
        }

        let categoryNode = [];
        return (
            <div className="category-sidebar-container">
                {this._renderCategories(categories, 0)}
            </div>
        );
    }

    @autobind
    private _renderCategories(categories: Array<Category>, level: number) {
        return (
            <div className="tree-item">
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
                                onClick={() => this.props.toggleCategory(category)}
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

    @autobind
    private _renderCollapseButton(level: number, category: Category, hasSubCategory: boolean) {
        if (!hasSubCategory) {
            return null;
        }

        let iconVariant = IconVariant.ARROW_DOWN;
        if (this.state.expandedParents[level] === category) {
            iconVariant = IconVariant.ARROW_UP;
        }
        return <IconButton className="category-collapse" icon={iconVariant} onClick={() => this._onExpand(level, category)}/>;
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
