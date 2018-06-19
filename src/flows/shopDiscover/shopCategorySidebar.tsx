import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import { Category } from "../../api/models";
import Button, { ButtonVariant, IconButton, LinkButton } from "../../components/button";
import Checkbox from "../../components/checkbox";
import Icon, { IconVariant } from "../../components/icon";

import "./style.scss";

interface ShopCategoryTreeSidebarProps {
    categoryList: Array<Category>;
    selectedCategory?: string;
    onApply?(values: string): void;
 }

interface ShopCategoryTreeSidebarState {
    expandedParents: Map<number, Category>;
}

export default class ShopCategoryTreeSidebar extends React.Component<ShopCategoryTreeSidebarProps, ShopCategoryTreeSidebarState> {
    state: ShopCategoryTreeSidebarState = {
        expandedParents: new Map(),
    };

    async componentWillReceiveProps() {
        const expandedParents = new Map<number, Category>();
        expandedParents[0] = null;
        expandedParents[1] = null;

        this.setState({expandedParents: expandedParents});
    }

    render() {
        return (
            <div>
                { this._renderCategoryTree(this.props.categoryList) }
            </div>
        );
    }

    @autobind
    private _onApply(category: string) {
        this.props.onApply(category);
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
            <ul className="tree-item">
                {categories.map(c =>
                    <li>
                        <LinkButton onClick={() => this._onApply(c.display_name)}>
                            {c.display_name} {this._renderCollapseButton(level, c, c.subcategories && c.subcategories.length > 0)}
                        </LinkButton>
                        {this.state.expandedParents[level] === c && <div className="subcategories">
                            {this._renderCategories(c.subcategories, level + 1)}
                        </div>}
                    </li>)}
            </ul>
        );
    }

    @autobind
    private _renderCollapseButton(level: number, category: Category, hasSubCategory: boolean) {
        if (!hasSubCategory) {
            return null;
        }

        let iconVariant = IconVariant.ARROW_RIGHT;
        if (this.state.expandedParents[level] === category) {
            iconVariant = IconVariant.ARROW_LEFT;
        }
        return <IconButton icon={iconVariant} onClick={() => this._onExpand(level, category)}/>;
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
