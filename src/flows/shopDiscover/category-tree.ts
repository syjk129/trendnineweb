import { Category } from "../../api/models";

export default class CategoryTree {
    selectedCategories: Set<string> = new Set();
    categories: Array<Category> = [];

    constructor(categories?: Array<Category>, selectedCategories?: Set<string>) {
        this.categories = categories || [];
        this.selectedCategories = selectedCategories || new Set();
    }

    populateSelectedCategories = (selectedCategories: Array<string>) => {
        if (!this.selectedCategories) {
            this.selectedCategories = new Set();
        }
        if (this.categories) {
            this.selectedCategories = selectedCategories.reduce((selectedCategories, categoryName) => {
                const category = this._findCategory(categoryName, this.categories);
                if (category) {
                    return this.addCategory(category, selectedCategories);
                }
                return selectedCategories;
            }, this.selectedCategories);
        }
    }

    private _findCategory = (categoryName: string, categories: Array<Category>) => {
        const found = categories.find(category => category.full_name === categoryName);
        if (found) return found;
        for (const category of categories) {
            if (category.full_name === categoryName) {
                return category;
            }
            return this._findCategory(categoryName, category.subcategories);
        }
        return null;
    }

    getQueryString = () => {
        if (this.selectedCategories.size > 0) {
            const sanitizedCategories = this._sanitizeCategories(Array.from(this.selectedCategories), this.categories);
            return sanitizedCategories.join(",");
        }
        return null;
    }

    private _sanitizeCategories = (selectedCategories: Array<string>, categories: Array<Category>) => {
        return selectedCategories.reduce((result, currentCategory) => {
            return categories.reduce((sanitized, c) => {
                if (currentCategory === c.full_name) {
                    return Array.from(this.removeCategories(c.subcategories, new Set(sanitized)));
                }
                if (c.subcategories && c.subcategories.length > 0) {
                    return this._sanitizeCategories(sanitized, c.subcategories);
                }
                return sanitized;
            }, result);
        }, selectedCategories);
    }

    toggleCategory = (category: Category) => {
        const currentCategory = this.selectedCategories.has(category.full_name);
        if (currentCategory) {
            this.removeCategoryParent(this.categories, this.categories[0], category);
            this.selectedCategories = this.removeCategory(category, this.selectedCategories);
        } else {
            this.addCategoryParent(this.categories, this.categories[0], category);
            this.selectedCategories = this.addCategory(category, this.selectedCategories);
        }
        return this.selectedCategories;
    }

    removeCategories = (categories: Array<Category>, selectedCategories: Set<string>) => {
        return categories.reduce((tree: Set<string>, subcategory: Category) => {
            return this.removeCategory(subcategory, tree);
        }, selectedCategories);
    }

    removeCategory = (category: Category, selectedCategories: Set<string>) => {
        let newTree = selectedCategories;
        newTree.delete(category.full_name);
        return category.subcategories.reduce((tree: Set<string>, subcategory: Category) => {
            return this.removeCategory(subcategory, tree);
        }, newTree);
    }

    addCategory = (category: Category, selectedCategories: Set<string>) => {
        let newTree = selectedCategories;
        newTree.add(category.full_name);
        return category.subcategories.reduce((tree: Set<string>, subcategory: Category) => {
            return this.addCategory(subcategory, tree);
        }, newTree);
    }

    removeCategoryParent = (categories: Array<Category>, current: Category, category: Category) => {
        for (const currentCategory of categories) {
            if (currentCategory.id === category.id) {
                this.selectedCategories.delete(currentCategory.full_name);
                this.selectedCategories.delete(current.full_name);
                return true;
            }
            if (this.removeCategoryParent(currentCategory.subcategories, currentCategory, category)) {
                this.selectedCategories.delete(current.full_name);
                return true;
            }
        }
        return false;
    }

    addCategoryParent = (categories: Array<Category>, current: Category, category: Category) => {
        for (const currentCategory of categories) {
            if (currentCategory.id === category.id) {
                if (categories.every(c => this.selectedCategories.has(c.full_name) || category.id === c.id)) {
                    this.selectedCategories.add(current.full_name);
                }
                return true;
            }
            if (this.addCategoryParent(currentCategory.subcategories, currentCategory, category)) {
                if (currentCategory.subcategories.every(c => this.selectedCategories.has(c.full_name) || category.id === c.id)) {
                    this.selectedCategories.add(current.full_name);
                }
                return true;
            }
        }
        return false;
    }
}
