import * as React from "react";
import { isMobile } from "react-device-detect";

import Button from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import ScrollTo from "../../../components/scrollTo";

import "./style.scss";

interface PageNavigationState {
    show: boolean;
}

interface PageNavigationProps {
}

export default class PageNavigation extends React.Component<PageNavigationProps, PageNavigationState>  {
    state: PageNavigationState = {
        show: false,
    };

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    onScroll = () => {
        if (window.pageYOffset >= 200) {
            this.setState({ show: true });
        } else {
            this.setState({ show: false });
        }
    }

    render() {
        return (
            <div className={isMobile ? "mobile-page-navigation" : ""}>
            {
                this.state.show && <Button className="page-navigation" onClick={() => ScrollTo({})}>
                    <Icon variant={IconVariant.ARROW_UP} size={isMobile ? IconSize.SMALL : IconSize.MEDIUM} />
                </Button>
            }
            </div>
        );
    }
}
