import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
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

import "./style.scss";

type Props = RouteProps;

interface BrandViewState {
    brandList: Array<Brand>;
    breakIndex: Array<number>;
    isLoading: boolean;
    sticked: boolean;
}

export default class BrandView extends React.Component<Props, BrandViewState> {
    static contextTypes: AppContext;

    state: BrandViewState = {
        brandList: [],
        breakIndex: [],
        isLoading: true,
        sticked: false,
    };

    componentWillMount() {
        if (isMobile) {
            this.props.history.push("/");
        }

        this.refreshContent(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (isMobile) {
            this.props.history.push("/");
        }
    }

    async refreshContent(props: Props) {
        const brandList = await this.context.api.getBrands("");

        let asciiCode = 0;
        let breakIndex = [0];
        brandList.forEach((brand, index) => {
            if (brand && brand.name) {
                let code = brand.name.charCodeAt(0);
                if (code !== asciiCode) {
                    asciiCode = code;
                    if (this._isAlphabet(code)) {
                        breakIndex.push(index);
                    }
                }
            }
        });

        this.setState({
            brandList,
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
            <div className="brands-content">
                <Sidebar>
                    <div className="sidebar-section">
                        <div className="sidebar-brand-header">
                            Brands
                        </div>
                    </div>

                    {recentlyViewed &&
                        <Sticky id="recently-viewed-section" stickyClassName="sticky-sidebar-recently-viewed">
                            <SidebarPostProductListSection title="Recently Viewed" items={recentlyViewed} />
                        </Sticky>
                    }
                </Sidebar>
                <Content>
                    <PageNavigation />
                    {this._renderAlphabet()}
                    {this._renderBrands()}
                </Content>
            </div>
        );
    }

    @autobind
    private _isSticked(sticked: boolean) {
        this.setState({sticked: sticked});
    }

    @autobind
    private _renderBrands() {
        // brands are sorted by the backend
        const brands = this.state.brandList;
        const breakIndex = this.state.breakIndex;
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;
        let output = [];

        return (
            <div className="brand-section-container">
            {
                breakIndex.map((index, i) => (
                    <div id={`section_${i}`} className="brand-section">
                        {brands[index] && brands[index].name && (
                            <div className="brand-section-header">{this._getHeader(brands[index].name)}</div>
                        )}
                        {brands.slice(index, breakIndex[i + 1]).map(b => (
                            <LinkButton to={isShop ? `/shop/discover?brands=${b.id}` : `/discover?brands=${b.id}`}>
                                {b.name}
                            </LinkButton>
                        ))}
                    </div>
                ))
            }
            </div>
        );
    }

    private _isAlphabet(code: number) {
        const A_ASCII_CODE = 65;
        const Z_ASCII_CODE = 90;
        const AA_ASCII_CODE = 97;
        const ZZ_ASCII_CODE = 122;
        return (code >= A_ASCII_CODE && code <= Z_ASCII_CODE) || (code >= AA_ASCII_CODE && code <= ZZ_ASCII_CODE);
    }

    private _getHeader(name: string) {
        if (this._isAlphabet(name.charCodeAt(0))) {
            return name.charAt(0);
        }
        return "0 - 9";
    }

    private _scrollTo(id: string) {
        ScrollTo({id: id, offsetY: this.state.sticked ? 80 : 130});
    }

    @autobind
    private _renderAlphabet() {
        const brands = this.state.brandList;
        const breakIndex = this.state.breakIndex;

        let output = [];

        breakIndex.forEach((index, i) => {
            const brand = brands[index];

            if (brand && brand.name) {
                output.push((
                <li>
                    <LinkButton onClick={() => this._scrollTo(`section_${i}`)}>
                        {this._getHeader(brand.name)}
                    </LinkButton>
                </li>));
            }
        });

        return (
            <Sticky  id="alphabet-list" stickyClassName="sticky-alphabet-list" isSticked={this._isSticked}>
                <ul className="alphabet-list">
                    {output}
                </ul>
            </Sticky>
        );
    }
}

BrandView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
