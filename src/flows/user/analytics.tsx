import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { ProductClicksResponse } from "../../api/responses";
import { AppContext } from "../../app";
import RouteProps from "../routeProps";

type Props = RouteProps;

interface AnalyticsState {
    productClicks: Array<any>;
    totalClicks: ProductClicksResponse;
}

class Analytics extends React.Component<Props, AnalyticsState> {
    static contextTypes: AppContext;

    state: AnalyticsState = {
        productClicks: [],
        totalClicks: null,
    }

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
                <div className="overview-title">
                    Overview
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
                <div className="overview-title">
                    Clicks by Product
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
}

Analytics.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(Analytics);
