import CoverImage from "./cover-image";
import Person from "./person";

export default class Post {
    id: string;
    title: string;
    author: Person;
    cover_image: CoverImage | null;
    modified: string; // TODO: use date
    products: Array<any>; // TODO: create product model
    product_tags: Array<any>;
    published_date: string;
    wishlisted: boolean;
    liked: boolean;
    likes: number;
    content: string;
    created: string; // TODO: serialize into Date
    tags: Array<any>; // TODO
}
