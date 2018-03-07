import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface RetailerFilterProps {
    active: boolean;
 }

export default class RetailerFilter extends React.Component<RetailerFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                Retailer Filter
            </div>
        );
    }
}
