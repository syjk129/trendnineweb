import * as React from "react";

import { LinkButton } from "../../components/button";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import PageNavigation from "../flowComponents/pageNavigation";
import { SidebarSection } from "../flowComponents/section";

import "./style.scss";

export default function ContatUs() {
    const pathname = location.pathname;
    const isShop = pathname.indexOf("/shop") > -1;
    const prevPage = isShop ? "Shop" : "Discover";
    const prevPageUrl = isShop ? "/shop/home" : "/discover";

    return (
        <div className="static-content">
            <Sidebar>
                <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;Contact Us
            </Sidebar>
            <Content>
                <PageNavigation />
                <p className="contact-header">Contact Us</p>
                <div className="contact-section">
                    <p className="contact-section-title">General</p>
                    <LinkButton href="mailto:info@trendnine.com">
                        info@trendnine.com
                    </LinkButton>
                </div>
                <div className="contact-section">
                    <p className="contact-section-title">Customer care / Feedback</p>
                    <LinkButton href="mailto:hello@trendnine.com">
                        hello@trendnine.com
                    </LinkButton>
                </div>
                <div className="contact-section">
                    <p className="contact-section-title">Influencer Partnership</p>
                    <LinkButton href="mailto:influencer@trendnine.com">
                        influencer@trendnine.com
                    </LinkButton>
                </div>
                <div className="contact-section">
                <p className="contact-section-title">Press Inquiries</p>
                    <LinkButton href="mailto:press@trendnine.com">
                        press@trendnine.com
                    </LinkButton>
                </div>
            </Content>
        </div>
    );
}

