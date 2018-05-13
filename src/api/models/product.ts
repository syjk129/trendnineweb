import CoverImage from "./cover-image";
import Person from "./person";

export default class Product {
    id: string;
    title: string;
    brand: any;
    merchant: any;
    price: number;
    retail_price: number;
    description: string;
    image: any;
    wishlisted: boolean;
}
