import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface OnSaleFilterProps {
    active: boolean;
 }

export default class OnSaleFilter extends React.Component<OnSaleFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                On Sale Filter
            </div>
        );
    }
}
