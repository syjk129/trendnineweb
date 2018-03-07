import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface CategoryFilterProps {
    active: boolean;
 }

export default class CategoryFilter extends React.Component<CategoryFilterProps> {
    render() {
        const { active } = this.props;
        const map = {
            "WOMEN": {
                "Beauty": {

                },
                "Accesorries": {

                },
                "Clothes": {

                },
                "Shoes": {
                    "Loafers": {},
                },
            },
            "MEN": {
                "Accessories": {

                },
                "Bags": {

                },
                "Clothing": {

                },
                "Grooming": {

                },
                "Shoes": {

                },
            },
        };

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                Category
            </div>
        );
    }
}
