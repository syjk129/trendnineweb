import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import { Category } from "../../../../api/models";
import Button, { ButtonVariant, IconButton } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
import Icon, { IconVariant } from "../../../../components/icon";
import SearchFilterInput from "./searchFilterInput";

import "./style.scss";

interface CategoryTreeFilterProps {
    active: boolean;
    categoryList: Array<Category>;
    selectedCategoryIds?: Array<string>;
    onApply?(values: Set<string>): void;
    onCancel?(): void;
 }

interface CategoryTreeFilterState {
    selectedCategories: Set<Category>;
    previousCategories: Set<Category>;
    expandedParents: Map<number, Category>;
    childToParentMap: Map<Category, Category>;
}

export default class CategoryTreeFilter extends React.Component<CategoryTreeFilterProps, CategoryTreeFilterState> {
    state: CategoryTreeFilterState = {
        selectedCategories: new Set(),
        previousCategories: new Set(),
        expandedParents: new Map(),
        childToParentMap: new Map(),
    };

    async componentWillReceiveProps() {
        const childToParentMap = new Map<Category, Category>();
        this.props.categoryList.map(c => this._populateChildToParent(childToParentMap, c));
        const expandedParents = new Map<number, Category>();
        expandedParents[0] = null;
        expandedParents[1] = null;

        const selectedCategories = new Set<Category>();
        this._mapCategoriesFromId(selectedCategories, this.props.selectedCategoryIds, this.props.categoryList);

        this.setState({childToParentMap: childToParentMap, expandedParents: expandedParents, selectedCategories: selectedCategories});
    }

    render() {
        return (
            <div className={`filter-content-container ${this.props.active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                    </div>
                    <div className="filter-action-buttons">
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={this._onApply}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                    { this._renderCategoryTree(this.props.categoryList) }
                </div>
            </div>
        );
    }

    @autobind
    private _onApply() {
        let selectedValues = new Set();
        this.state.selectedCategories.forEach(c => {
            selectedValues.add(c.full_name);
        });

        this.state.selectedCategories.forEach(c => {
            c.subcategories.map(s => {
                selectedValues.delete(s.full_name);
            });
        });
        this.setState({previousCategories: new Set(this.state.selectedCategories)});
        this.props.onApply(selectedValues);
    }

    @autobind
    private _renderCategoryTree(categories: Array<Category>) {
        if (!categories || categories.length < 1) {
            return;
        }

        let categoryNode = [];
        return (
            <div className="category-filter-container">
                <div className="tree-checkbox-container">
                    {this._renderCategories(categories, 0)}
                </div>
                {this.state.expandedParents[0] &&
                    <div className="tree-checkbox-container">
                        {this._renderCategories(this.state.expandedParents[0].subcategories, 1)}
                    </div>
                }
                {this.state.expandedParents[1] &&
                    <div className="tree-checkbox-container">
                        {this._renderCategories(this.state.expandedParents[1].subcategories, 2)}
                    </div>
                }
            </div>
        );
    }

    @autobind
    private _inSelectedCategory(c: Category) {
        if (this.state.selectedCategories.has(c)) {
            return true;
        }

        if (!this.state.childToParentMap.has(c)) {
            return false;
        }

        return this._inSelectedCategory(this.state.childToParentMap.get(c));
    }

    @autobind
    private _renderCategories(categories: Array<Category>, level: number) {
        return categories.map(c =>
            <div className="tree-checkbox">
                <Checkbox
                    value={c.full_name}
                    label={c.display_name}
                    checked={this._inSelectedCategory(c)}
                    onChange={() => this._toggleSelectedCategories(c)} />
                {this._renderCollapseButton(level, c, c.subcategories && c.subcategories.length > 0)}
            </div>);
    }

    @autobind
    private _toggleSelectedCategories(c: Category) {
        let selectedCategories = this.state.selectedCategories;
        if (this._inSelectedCategory(c)) {
            this._toggleCheckboxTree(c, selectedCategories, false);
        } else {
            this._toggleCheckboxTree(c, selectedCategories, true);
        }

        this.setState({selectedCategories});
    }

    private _toggleCheckboxTree(c: Category, selectedCategories: Set<Category>, checked: boolean) {
        let parent = this.state.childToParentMap.get(c);

        if (checked) {
            if (!selectedCategories.has(c)) {
                selectedCategories.add(c);
            }

            while (parent) {
                let hasAll = true;
                parent.subcategories.forEach(sub => {
                    hasAll = hasAll && selectedCategories.has(sub);
                });
                if (hasAll) {
                    selectedCategories.add(parent);
                    parent = this.state.childToParentMap.get(parent);
                } else {
                    break;
                }
            }

        } else {
            selectedCategories.delete(c);


            while (parent) {
                selectedCategories.delete(parent);
                parent = this.state.childToParentMap.get(parent);
            }
        }

        if (c.subcategories && c.subcategories.length > 0) {
            c.subcategories.map(sub => this._toggleCheckboxTree(sub, selectedCategories, checked));
        }
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

    @autobind
    private _cancel() {
        this.setState({selectedCategories: new Set(this.state.previousCategories)});
        this.props.onCancel();
    }

    private _mapCategoriesFromId(output: Set<Category>, ids: Array<string>, categories: Array<Category>) {
        if (!categories || categories.length < 1) {
            return;
        }
        categories.map(c => {
            if (ids.indexOf(c.full_name) > -1) {
                output.add(c);
            }
            this._mapCategoriesFromId(output, ids, c.subcategories);
        });
    }

    private _populateChildToParent(c2p: Map<Category, Category>, category: Category) {
        if (!category || !category.subcategories || category.subcategories.length < 1) {
            return;
        }

        category.subcategories.map(c => {
            c2p.set(c, category);
            this._populateChildToParent(c2p, c);
        });
    }
}
