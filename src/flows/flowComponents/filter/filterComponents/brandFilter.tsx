import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface BrandFilterProps {
    active: boolean;
 }

export default class BrandFilter extends React.Component<BrandFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                Brand Filter
            </div>
        );
    }
}
