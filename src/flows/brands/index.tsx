import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match, withRouter } from "react-router-dom";

import Brand from "../../api/models/brand";
import { AppContext, AppContextTypes } from "../../app";
import { LinkButton } from "../../components/button";
import Content from "../../components/content";
import ScrollTo from "../../components/scrollTo";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import PageNavigation from "../flowComponents/pageNavigation";
import { SidebarPostProductListSection, SidebarSection } from "../flowComponents/section";
import RouteProps from "../routeProps";
import DesktopBrands from "./desktop";
import MobileBrands from "./mobile";

import "./style.scss";

type Props = RouteProps;

interface BrandViewState {
    brandList: Array<Brand>;
    breakIndex: Array<number>;
    isLoading: boolean;
}

export default class BrandView extends React.Component<Props, BrandViewState> {
    static contextTypes: AppContext;

    state: BrandViewState = {
        brandList: [],
        breakIndex: [],
        isLoading: true,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    async refreshContent(props: Props) {
        let asciiCode = 0;
        let breakIndex = [0];
        let idx = 0;
        let brands = [];
        let nextToken = null;

        while (true) {
            const brandList = await this.context.api.getBrands("", nextToken);
            brandList.list.forEach((brand) => {
                if (brand && brand.name) {
                    let code = brand.name.charCodeAt(0);
                    if (code !== asciiCode) {
                        asciiCode = code;
                        if (this._isAlphabet(code)) {
                            breakIndex.push(idx);
                        }
                    }
                    idx++;
                    brands.push(brand);
                }
            });

            nextToken = brandList.nextToken;
            if (!nextToken) {
                break;
            }
        }

        this.setState({
            brandList: brands,
            breakIndex,
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed"));

        return (
            <>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopBrands
                        brands={this.state.brandList}
                        breakIndex={this.state.breakIndex}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileBrands
                        brands={this.state.brandList}
                        breakIndex={this.state.breakIndex}
                    />
                </MobileView>
            </>
        );
    }

    private _isAlphabet(code: number) {
        const A_ASCII_CODE = 65;
        const Z_ASCII_CODE = 90;
        const AA_ASCII_CODE = 97;
        const ZZ_ASCII_CODE = 122;
        return (code >= A_ASCII_CODE && code <= Z_ASCII_CODE) || (code >= AA_ASCII_CODE && code <= ZZ_ASCII_CODE);
    }
}

BrandView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
