import ImageRequest from "./image";
import TagRequest from "./tag";

export default interface PostRequest {
    title: string;
    content: string;
    tag_list: Array<string>;
    occasion_tag_list: Array<string>;
    style_tag_list: Array<string>;
    cover_image_url: string;
    images: Array<ImageRequest>;
    product_tags: Array<TagRequest>;
}
