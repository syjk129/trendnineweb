import * as React from "react";

import Icon, { IconSize, IconVariant } from "../../../components/icon";

interface RefineSectionProps {
    isOpen?: boolean;
    className?: string;
    name: string;
    children: React.ReactNode;
}

interface RefineSectionState {
    isOpen: boolean;
}

export default class RefineSection extends React.Component<RefineSectionProps, RefineSectionState> {
    state: RefineSectionState = {
        isOpen: this.props.isOpen || false,
    };

    render() {
        let classes = "refine-section";
        if (this.props.className) {
            classes += ` ${this.props.className}`;
        }

        return (
            <div className={classes}>
                <div className="refine-section-header" onClick={this._toggleOpen}>
                    {this.props.name}
                    <Icon
                        variant={this.state.isOpen ? IconVariant.ARROW_UP : IconVariant.ARROW_DOWN}
                        size={IconSize.SMALL}
                    />
                </div>
                {this.state.isOpen && (
                    <div className="refine-section-content">
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }

    private _toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
