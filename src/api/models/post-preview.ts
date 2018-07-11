import CoverImage from "./cover-image";
import Person from "./person";

export default class PostPreview {
    id: string;
    title: string;
    author: Person;
    created: string;
    cover_image: CoverImage;
    modified: string; // TODO: use date
    products: Array<any>; // TODO: create product model
    wishlisted: boolean;
    liked: boolean;
    likes: number;
    published_date: string;
    rank_change?: number;
}
