import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface PriceFilterProps {
    active: boolean;
 }

export default class PriceFilter extends React.Component<PriceFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                Price Filter
            </div>
        );
    }
}
