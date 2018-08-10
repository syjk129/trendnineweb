import autobind from "autobind-decorator";
import * as React from "react";
import { Link } from "react-router-dom";

import Button, { ButtonVariant, LinkButton } from "../../components/button";
import Carousel from "../../components/carousel";
import MobileCarouselItem from "../../components/carousel/mobileCarouselItem";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Input, { InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
import ScrollTo from "../../components/scrollTo";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import { BrandsProps } from "./types";

import "./style.scss";

interface MobileBrandsState {
    sticked: boolean;
}

export default class MobileBrands extends React.Component<BrandsProps, MobileBrandsState> {
    render() {
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed"));

        return (
            <div className="mobile-brands">
                <div className="mobile-brands-header">
                    Brands
                </div>

                {this._renderAlphabet()}
                {this._renderBrands()}
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
        const brands = this.props.brands;
        const breakIndex = this.props.breakIndex;
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;
        let output = [];

        return (
            <div className="mobile-brand-section-container">
            {
                breakIndex.map((index, i) => (
                    <div id={`section_${i}`} className="brand-section">
                        {brands[index] && brands[index].name && (
                            <div className="brand-section-header">{this._getHeader(brands[index].name)}</div>
                        )}
                        {brands.slice(index, breakIndex[i + 1]).map(b => (
                            <LinkButton to={isShop ? `/shop/discover?brands=${b.id}` : `/discover?brands=${b.id}`}>
                                {b.name} ({b.item_count})
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

    private _scrollTo(id: string) {
        ScrollTo({id: id, offsetY: this.state.sticked ? 80 : 130});
    }

    private _getHeader(name: string) {
        if (this._isAlphabet(name.charCodeAt(0))) {
            return name.charAt(0);
        }
        return "0 - 9";
    }

    @autobind
    private _renderAlphabet() {
        const brands = this.props.brands;
        const breakIndex = this.props.breakIndex;

        let output = [];

        breakIndex.forEach((index, i) => {
            const brand = brands[index];

            if (brand && brand.name) {
                output.push((
                    <LinkButton onClick={() => this._scrollTo(`section_${i}`)}>
                        {this._getHeader(brand.name)}
                    </LinkButton>
                ));
            }
        });

        return (
            <Sticky id="alphabet-list" stickyClassName="sticky-alphabet-list" isSticked={this._isSticked}>
                <div className="alphabet-list">
                    {output}
                </div>
            </Sticky>
        );
    }
}
