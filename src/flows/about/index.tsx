import * as React from "react";

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
    const prevPageUrl = isShop ? "/shop/home" : "/discover";

    return (
        <div className="static-content">
            <Sidebar>
                <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;About
            </Sidebar>
            <Content>
                <PageNavigation />
                <div className="about-header">
                    <p className="about-header-title">
                        Welcome to TrendNine <br />
                        <i>Shop in Style</i>
                    </p>
                    <p>Discover and shop your favorite looks from thousands of fashion influencers.</p>
                </div>
                <div className="about-information-section">
                    <div className="about-section">
                        <p className="about-section-title">About TrendNine</p>
                        <p>TrendNine is the world's first one-stop shop featuring the latest fashion and styles from influencers worldwide. Before TrendNine, digital shoppers went through scattered channels of social media, blogs, and online stores. This was often a time-consuming process that did not result in any purchases. TrendNine transforms this shopping experience by connecting thousands of influencers and brands with customers in one place, with unparalleled online shopping features.</p>
                    </div>
                    <div className="about-section">
                        <p className="about-section-title">Our Mission</p>
                        <p>At TrendNine, our goal is twofold: First, we want to provide an all-in-one shopping experience, from inspiration, discovery, to purchase. Secondly, we want to curate the best style inspirations from top fashion influencers from around the world. Through these efforts, we seek to unlock value for not only the shopper, but also influencers and brands. TrendNine was founded in 2017 by a team that consisted of a Wall Street banker, Amazon engineer, and a Hollywood executive, none of whom are as fashionable as the thousands of influencers on TrendNine today.</p>
                    </div>
                    <div className="about-section">
                        <p className="about-section-title">Our Name</p>
                        <p>There is an undeniable moment of bliss when you come across the perfect outfit, whether it is through a chance discovery or arduous research. Our goal is to provide a cloud nine (defined as a state of euphoria) shopping experience, centered around the latest trending fashion and influencers. Hence, TrendNine was born.</p>
                    </div>
                </div>
                <div className="about-findout-section">
                    <p className="about-findout-title">Here you can find out</p>
                    <div className="about-findout-content">
                        <Image src="https://s3.amazonaws.com/trendnine-static/images/what_they_wear.png" />
                        <div className="findout-section">
                            <p className="findout-number">1</p>
                            <p className="findout-title">What they wear.</p>
                            <p>Discover the most sought-after pieces worn by influencers around the world.</p>
                        </div>
                    </div>
                    <div className="about-findout-content">
                        <div className="findout-section">
                            <p className="findout-number">2</p>
                            <p className="findout-title">How they wear it.</p>
                            <p>Get inspired by the latest looks and style tips from your favorite influencers.</p>
                        </div>
                        <Image src="https://s3.amazonaws.com/trendnine-static/images/how_they_wear.png" />
                    </div>
                    <div className="about-findout-content">
                        <Image src="https://s3.amazonaws.com/trendnine-static/images/where_to_get.png" />
                        <div className="findout-section">
                            <p className="findout-number">3</p>
                            <p className="findout-title">Where to get it.</p>
                            <p>Shop exact-match products and more from thousands of brands in one place.</p>
                        </div>
                    </div>
                </div>
                <div className="about-get-section">
                    <div className="about-get-content">
                        <p className="about-get-title">Get it before it's gone.</p>
                        <p>You’ll be the first to know what your favorite influencers wear.</p>
                        <LinkButton className="button rounded button-outline" to={prevPageUrl}>SHOP NOW</LinkButton>
                    </div>
                </div>
            </Content>
        </div>
    );
}

