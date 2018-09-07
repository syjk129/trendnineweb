import { Category, PostTag } from "../../api/models";
import RouteProps from "../../flows/routeProps";

export interface HeaderProps extends RouteProps {
    styles: Array<PostTag>;
    occasions: Array<PostTag>;
    categories: Array<Category>;
    loggedIn: boolean;
    bannerAction: React.ReactNode;
    bannerContent: React.ReactNode;
    dismissBanner(): void;
}
