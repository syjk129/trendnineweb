import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { ProductClicksResponse } from "../../api/responses";
import { AppContext } from "../../app";
import Select from "../../components/select";
import RouteProps from "../routeProps";

enum SortDateRange {
    TODAY = "today",
    THIS_WEEK = "this_week",
    THIS_MONTH = "this_month",
    LAST_MONTH = "last_month",
}

const SortDateRangeDisplay = {
    [SortDateRange.TODAY]: "Today",
    [SortDateRange.THIS_WEEK]: "This Week",
    [SortDateRange.THIS_MONTH]: "This Month",
    [SortDateRange.LAST_MONTH]: "Last Month",
};

type Props = RouteProps;

interface AnalyticsState {
    productClicks: Array<any>;
    totalClicks: ProductClicksResponse;
    overviewDateRange: SortDateRange;
    productDateRange: SortDateRange;
}

class Analytics extends React.Component<Props, AnalyticsState> {
    static contextTypes: AppContext;

    state: AnalyticsState = {
        productClicks: [],
        totalClicks: null,
        overviewDateRange: SortDateRange.THIS_WEEK,
        productDateRange: SortDateRange.THIS_WEEK,
    };

    async componentWillMount() {
        const [
            productClicks,
            totalClicks,
        ] = await Promise.all([
            this.context.api.getTrackedProductClicks("this_week"),
            this.context.api.getTrackedClicks("this_week"),
        ]);

        this.setState({ productClicks, totalClicks });
    }

    render() {
        return (
            <div className="analytics">
                <div className="click-details">
                    <div className="overview-title">
                        Overview
                    </div>
                    <Select value={this.state.overviewDateRange} onChange={this._onOverviewDateRangeSelect}>
                        {Object.keys(SortDateRange).map(dateRange => (
                            <option value={SortDateRange[dateRange]}>
                                {SortDateRangeDisplay[SortDateRange[dateRange]]}
                            </option>
                        ))}
                    </Select>
                </div>
                {this.state.totalClicks && (
                    <table>
                        <tr className="header">
                            <th>Total Clicks</th>
                            <th>Total Clicks from Profile</th>
                            <th>Total Clicks from Post</th>
                        </tr>
                        <tr className="table-item">
                            <th>{this.state.totalClicks.total_clicks}</th>
                            <th>{this.state.totalClicks.total_clicks_via_influencer_page}</th>
                            <th>{this.state.totalClicks.total_clicks_via_post}</th>
                        </tr>
                    </table>
                )}
                <div className="click-details">
                    <div className="overview-title">
                        Clicks by Product
                    </div>
                    <Select value={this.state.productDateRange} onChange={this._onProductDateRangeSelect}>
                        {Object.keys(SortDateRange).map(dateRange => (
                            <option value={SortDateRange[dateRange]}>
                                {SortDateRangeDisplay[SortDateRange[dateRange]]}
                            </option>
                        ))}
                    </Select>
                </div>
                <table>
                    <tr className="header">
                        <th>Product Name</th>
                        <th>Clicks</th>
                    </tr>
                    {this.state.productClicks.map(product => (
                        <tr className="table-item">
                            <th className="product-title">{product.title}</th>
                            <th>{product.clicks}</th>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }

    private _onOverviewDateRangeSelect = async (overviewDateRange) => {
        this.setState({ overviewDateRange });

        const totalClicks = await this.context.api.getTrackedClicks(overviewDateRange);
        this.setState({ totalClicks });
    }

    private _onProductDateRangeSelect = async (productDateRange) => {
        this.setState({ productDateRange });

        const productClicks = await this.context.api.getTrackedProductClicks(productDateRange);
        this.setState({ productClicks });
    }
}

Analytics.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(Analytics);
