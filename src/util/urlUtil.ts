export function encodeCategoryUrl(category: string | null) {
    if (category) {
        return category.replace(/\s/g, "-");
    }
    return category;
}

export function decodeCategoryUrl(category: string | null) {
    if (category) {
        return category.replace(/-/g, " ");
    }
    return category;
}
