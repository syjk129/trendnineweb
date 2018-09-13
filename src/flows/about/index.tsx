import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { Helmet } from "react-helmet";

import { LinkButton } from "../../components/button";
import Content from "../../components/content";
import Image from "../../components/image";
import Sidebar from "../../components/sidebar";
import PageNavigation from "../flowComponents/pageNavigation";

import "./style.scss";

export default function AboutUs() {
    const pathname = location.pathname;
    const isShop = pathname.indexOf("/shop") > -1;
    const prevPage = isShop ? "Shop" : "Discover";
    const prevPageUrl = isShop ? "/shop" : "/";

    const renderContent = () => {
        return (
            <div>
                <div className="about-header">
                    <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_top_Photo.png" />
                    <h3 className="about-header-title">
                        Welcome to TrendNine <br />
                        <i>Shop in Style</i>
                    </h3>
                </div>
                <div className="about-information-section">
                    <div className="about-section">
                        {isMobile && <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_our_overview.png" />}
                        <div className="about-section-content">
                            <p className="about-section-title">Our Overview</p>
                            <p>TrendNine is the first one-stop shop featuring the latest fashion and styles from influencers worldwide. Before TrendNine, digital shoppers searched through scattered social media channels, blogs, and online stores. TrendNine transforms this time-consuming process into a seamless shopping experience by connecting you with thousands of influencers and brands in one place.</p>
                        </div>
                        {!isMobile && <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_our_overview.png" />}
                    </div>
                    <div className="about-section">
                        <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_our_mission.png" />
                        <div className="about-section-content">
                            <p className="about-section-title">Our Mission</p>
                            <p>At TrendNine, we want to provide you with an all-in-one shopping experience, from inspiration, discovery, to purchase, while curating the best style inspirations from top fashion influencers. Through these efforts, we seek to unlock the value for you as well as influencers and brands. TrendNine was founded in 2017 by a team of millennials who wanted a quick and simple way to keep their wardrobes up to date on the latest influencer fashion trends.</p>
                        </div>
                    </div>
                    <div className="about-section">
                        {isMobile && <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_our_name.png" />}
                        <div className="about-section-content">
                            <p className="about-section-title">Our Name</p>
                            <p>There is an undeniable moment of bliss when you come across the perfect outfit, whether it is through a chance discovery or arduous research. Our goal is to provide a Cloud Nine (defined as a state of euphoria) shopping experience, centered around the latest trending fashion and influencers. Thus, TrendNine was born.</p>
                        </div>
                        {!isMobile && <Image src="https://s3.amazonaws.com/trendnine-static/images/about_us_our_name.png" />}
                    </div>
                </div>
                <div className="about-findout-section">
                    <p className="about-findout-title">Here you can find out</p>
                    <div className="about-findout-content">
                        <div className="findout-section">
                            <p className="findout-number">1.</p>
                            <p className="findout-title">What they wear.</p>
                            <p>Discover the most sought-after pieces worn by influencers around the world.</p>
                        </div>
                        <div className="findout-section">
                            <p className="findout-number">2.</p>
                            <p className="findout-title">How they wear it.</p>
                            <p>Get inspired by the latest looks and style tips from your favorite influencers.</p>
                        </div>
                        <div className="findout-section">
                            <p className="findout-number">3.</p>
                            <p className="findout-title">Where to get it.</p>
                            <p>Shop exact-match products and more from thousands of brands in one place.</p>
                        </div>
                    </div>
                </div>
                <div className="about-get-section">
                    <div className="about-get-content">
                        <h3 className="about-get-title">Get it before it's gone.</h3>
                        <p>You’ll be the first to know what your favorite influencers wear.</p>
                        <LinkButton className="button rounded button-outline" to={prevPageUrl}>GET STARTED</LinkButton>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Helmet defer={false}>
                <title>About</title>
                <meta name="description" content="TrendNine is the first one-stop shop featuring the latest fashion and styles from influencers worldwide." />
            </Helmet>
            <div className={isMobile ? "static-content mobile-static-content" : "static-content"}>
                <PageNavigation />
                <BrowserView viewClassName="flex" device={isBrowser}>
                    <Sidebar>
                        <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;About Us
                    </Sidebar>
                    <Content>
                    { renderContent() }
                    </Content>
                </BrowserView>
                <MobileView device={isMobile}>
                    <div className="mobile-link-button">
                    <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;About Us
                    </div>
                    { renderContent() }
                </MobileView>
            </div>
        </>
    );
}

