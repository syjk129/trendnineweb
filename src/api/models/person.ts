export default class Person {
    id: string;
    auth_level: number;
    tier: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    profile_small_image_url: string | null;
    profile_thumbnail_image_url: string | null;
    introduction: string;
    blog_post_count: number;
    product_count: number;
    follower_count: number;
    following_count: number;
    followed: boolean;
    youtube_url: string | null;
    instagram_url: string | null;
    blog_url: string | null;
}
