import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import { Category } from "../../../../api/models";
import Button, { ButtonVariant } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
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
    selectedValues: Set<string>;
    previousValues: Set<string>;
    childToParentMap: Map<string, Category>;
}

export default class CategoryTreeFilter extends React.Component<CategoryTreeFilterProps, CategoryTreeFilterState> {
    state: CategoryTreeFilterState = {
        selectedValues: this.props.selectedCategoryIds ? new Set(this.props.selectedCategoryIds) : new Set(),
        previousValues: new Set(),
        childToParentMap: new Map(),
    };

    async componentWillReceiveProps() {
        let childToParentMap = new Map<string, Category>();
        this.props.categoryList.map(c => this._populateChildToParent(childToParentMap, c));
        this.setState({childToParentMap: childToParentMap});
    }

    render() {
        return (
            <div className={`filter-content-container ${this.props.active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                    </div>
                    <div className="filter-action-buttons">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            onClick={this._onApply}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                    { this._renderCategoryTree(this.props.categoryList, null) }
                </div>
            </div>
        );
    }

    @autobind
    private _onApply() {
        this.setState({previousValues: new Set(this.state.selectedValues)});
        this.props.onApply(this.state.selectedValues);
    }

    @autobind
    private _updateValues(category: Category) {
        let v = this.state.selectedValues;
        if (v.has(category.id)) {
            this._toggleSubCategories(v, category, true);
            this._toggleParentCategories(v, category, true);
        } else {
            this._toggleSubCategories(v, category, false);
            const parent = this.state.childToParentMap.get(category.id);
            if (parent && parent.subcategories.every(s => v.has(s.id))) {
                this._toggleParentCategories(v, category, false);
            }
        }
        this.setState({selectedValues: v});
    }

    @autobind
    private _renderCategoryTree(categories: Array<Category>, parent: Category) {
        if (!categories || categories.length < 1) {
            return;
        }

        const categoryNode = categories.map(c => (
            <li>
                <Checkbox
                    value={c.id}
                    label={c.display_name}
                    onChange={(value) => this._updateValues(c)}
                    checked={this.state.selectedValues.has(c.id)}
                />
                { this._renderCategoryTree(c.subcategories, c) }
             </li>
        ));

        return  (<ul className={"filter-result-list"}>
            { categoryNode }
        </ul>);
    }

    @autobind
    private _cancel() {
        this.setState({selectedValues: new Set(this.state.previousValues)});
        this.props.onCancel();
    }

    private _toggleSubCategories(v: Set<string>, category: Category, remove: boolean) {
        if (!category) {
            return;
        }

        if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.map(c => this._toggleSubCategories(v, c, remove));
        }

        if (remove) {
            v.delete(category.id);
        } else {
            v.add(category.id);
        }
    }

    private _toggleParentCategories(v: Set<string>, category: Category, remove: boolean) {
        if (!category || !this.state.childToParentMap.has(category.id)) {
            return;
        }

        let parent = this.state.childToParentMap.get(category.id);
        this._toggleParentCategories(v, parent, remove);

        if (remove) {
            v.delete(parent.id);
        } else {
            v.add(parent.id);
        }
    }

    private _populateChildToParent(c2p: Map<string, Category>, category: Category) {
        if (!category || !category.subcategories || category.subcategories.length < 1) {
            return;
        }

        category.subcategories.map(c => {
            c2p.set(c.id, category);
            this._populateChildToParent(c2p, c);
        });
    }
}
