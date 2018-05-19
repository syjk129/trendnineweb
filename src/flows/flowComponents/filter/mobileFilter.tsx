import * as React from "react";

import { IconButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Sticky from "../../../components/sticky";

import "./style.scss";

interface MobileFilterProps {
    setGridSize(size: number): void;
}

export default class MobileFilter extends React.Component<MobileFilterProps> {
    render() {
        return (
            <Sticky id="mobile-filter" stickyClassName="sticky-mobile-filter">
                <div className="mobile-filter">
                    <div>
                        Filter
                    </div>
                    <div className="grid-sizes">
                        <IconButton
                            icon={IconVariant.GRID_SIZE_1}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(1)}
                        />
                        <IconButton
                            icon={IconVariant.GRID_SIZE_2}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(2)}
                        />
                        <IconButton
                            icon={IconVariant.GRID_SIZE_3}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(3)}
                        />
                   </div>
                </div>
            </Sticky>
        );
    }
}
