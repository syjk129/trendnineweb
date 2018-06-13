import autobind from "autobind-decorator";
import * as React from "react";

import { IconButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import "./style.scss";

interface ExpandableSectionProps {
    title: string;
    children?: React.ReactNode;
}

interface ExpandableSectionState {
    isOpen: boolean;
}

export default class ExpandableSection extends React.Component<ExpandableSectionProps, ExpandableSectionState> {
    state: ExpandableSectionState = {
        isOpen: false,
    };

    render() {
        return (
            <div className="expandable-section">
                <div className="section-header" onClick={this._toggleOpen}>
                    <p>{this.props.title}</p>
                    <IconButton icon={IconVariant.PLUS_OPEN} size={IconSize.SMALL} selected={this.state.isOpen} />
                </div>
                {this.state.isOpen && this.props.children}
            </div>
        );
    }

    @autobind
    private _toggleOpen() {
        this.setState({ isOpen: !this.state.isOpen });
    }
}