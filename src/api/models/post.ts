import Person from "./person";

export default class Post {
    id: string;
    title: string;
    author: Person;
    modified: string; // TODO: use date
    products: Array<any>; // TODO: create product model
    wishlisted: boolean;
    liked: boolean;
    likes: number;
}
