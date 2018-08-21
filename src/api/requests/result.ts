export default interface ResultRequest {
    title: string;
    caption: string;
    tag_list: Array<string>;
    occasion_tag_list: Array<string>;
    style_tag_list: Array<string>;
    cover_image_url: string;
    priority_level: number;
    cta_url: string;
}
