export default class Category {
    id: string;
    full_name: string;
    display_name: string;
    subcategories: Array<Category>;
}
