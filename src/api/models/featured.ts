import CoverImage from "./cover-image";
import FeaturedType from "./featured-type";

export default class Featured {
    id: string;
    type: FeaturedType;
    title: string;
    content: string | null;
    caption: string | null;
    cover_image: CoverImage;
    direct_url: string | null;
    priority_level: number;
    tags: Array<string>;
    occasion_tags: Array<any>;
    style_tags: Array<any>;
}
