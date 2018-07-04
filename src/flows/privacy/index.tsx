import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { LinkButton } from "../../components/button";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import PageNavigation from "../flowComponents/pageNavigation";

export default function PrivacyPolicy() {
    const pathname = location.pathname;
    const isShop = pathname.indexOf("/shop") > -1;
    const prevPage = isShop ? "Shop" : "Discover";
    const prevPageUrl = isShop ? "/shop" : "/discover";
    const renderContent = () => {
        return (
            <div>
                <h3>Privacy Policy</h3>
                <p>
                    TrendNine Inc. (”TrendNine", "we", “us”, “our”) provides its services through the TrendNine.com website (the "Site"), certain software applications downloadable to supported mobile devices, consumer electronic devices and other mechanisms (collectively, the “Applications”). Our service, the Site Content (defined below), and any other features, tools, materials, products and services we offer through the Portals are collectively referred to as the “Service”.
            </p>
                <p>
                    This Privacy Policy (this “Policy”) explains how the Service collects and uses certain personally identifiable information and non-personally identifiable information provided by You or Your computer, mobile device, consumer electronic device or other mechanism. This Policy also explains how TrendNine uses and maintains that information, and with whom it may be shared. Your use of the Service, and/or Your participation in activities and offerings through the Service, represents Your agreement with TrendNine to be bound by this Policy. Please understand that this is a binding legal agreement. If You do not want to comply with this Policy, then You should not use the Service, so please read this Policy carefully.
            </p>
                <p>
                    The TrendNine Terms of Use define how You may use the Service. The TrendNine Terms of Use can be found here and are incorporated into this Policy by reference. Therefore, by agreeing to this Policy, you agree that your engagement with and use of the Service are governed by the Terms of Use in effect at the time of your use.                    </p>
                <p>
                    This Policy may be modified at any time and from time to time by TrendNine. The current version of this Policy can always be found under the “Privacy Policy” button on the Site. You can tell if there have been changes to this Policy by checking the date at the bottom of the Policy page. Your continued use of the Service after an update to the Policy will constitute Your acceptance of, and agreement to be bound by, the updated version of the Policy.
            </p>
                <p>
                    <b>PLEASE NOTE:</b>&nbsp;<u>You must be at least 13 years of age to use the Service and engage in activities through the Service. If You are not at least 13 years old, You should not be accessing Site Content, using the Service or submitting any PII ("Personally Identifiable Information").</u>
                </p>
                <p>
                </p><h5>Types of Information Collected</h5>
                <p>
                    We receive both information that is directly provided to us, such as personal information you provide when you visit the Services, and information that is passively or automatically collected from you, such as anonymous information collected from your browser or device. In this Privacy Policy, we refer to all of this as the “Information”.
                </p>
                <p>
                </p><ol>
                    <li>
                        Information You Provide to Us. One type of Information is the kind that you provide to us that can identify You as a specific individual. We only collect PII when You provide it to us directly in order to register as a member, access or connect to our Service through application(s), participate in certain activities on the Service, or communicate with us. In the course of these various offerings, we often seek to collect from your various forms of information, such as: name, address, e-mail address, telephone number, and credit card information.
                        </li>
                    <li>
                        Information That is Passively or Automatically Collected. Another type of information is the kind of non-personally identifiable information (“NPII”) collected and stored using automated methods. We, and our “Partners” who include affiliates, third party service providers, advertisers, advertising networks and platforms, agencies, and distribution or other partners may use automated means to collect various types of Information about you, your computer or other device used to access our Services. A representative, non-exhaustive list of the types of automatically collected information may include: network or Internet protocol address and type of browser you are using (e.g., Chrome, Safari, Firefox, Internet Explorer), the type of operating system you are using, (e.g., Microsoft Windows or Mac OS), the name of your Internet service provider (e.g., Comcast, Verizon or AT&T) and domains used by such providers, mobile network, device identifiers (such as an Apple IDFA or an Android Advertising ID), device settings, browser settings, the web pages of the Services you have visited, Services visited before and after you visit a Service, the type of handheld or mobile device used to view the Service (e.g., iOS, Android), your geographic location information, the nature of the product or service requested or purchased, browsing, shopping, and purchase history, your geolocation, and the content and advertisements you have accessed, seen, forwarded and/or clicked on.
                        </li>
                    <li>
                        Information Collected By and From Social Media Services and Other Third Party Platforms. You also can engage with our content on or through social media services or other third party platforms, such as Facebook, or other third-party social media plug-ins, integrations and applications. When you engage with our content on or through social media services or other third party platforms, plug-ins, integrations or applications, you may allow us to have access to certain Information in your profile. This may include your name, e-mail address, photo, gender, birthday, location, an ID associated with the applicable third party platform or social media account user files, like photos and videos, your list of friends or connections, people you follow and/or who follow you, or your posts or “likes.” For a description on how social media services and other third party platforms, plug-ins, integrations or applications handle your information, please refer to their respective privacy policies and terms of use, which may permit you to modify your privacy settings. When we interact with you through our content on third party websites, applications, integrations or platforms, we may obtain any information regarding your interaction with that content, such as content you have viewed, your game performance, high scores, and information about advertisements within the content you have been shown or may have clicked on.
                        </li>
                </ol>
                <p></p>
                <p></p>
                <p>
                </p><h5>Collection of PII</h5>
                <p>
                    TrendNine collects PII in the following ways:
                    </p><ol>
                    <li>
                        If You register as a member on the Service or participate in certain activities on the Service, You will be asked to provide a limited amount of PII to allow us to establish Your account, personalize Your experience on the Service, and communicate with You in connection with Your use of the Service. &nbsp;<b>You can edit the PII in Your account at any time by logging into the Site and clicking the “My Account” button.</b>
                    </li>
                    <li>
                        When You notify us of a problem with any Site Content or the operation of the Service, or when You submit a suggestion, complaint, question, request, or any other e-mail correspondence, TrendNine asks for Your e-mail address so that You can receive a response. This information will only be used to notify You that we have received Your communication and to address Your comments or concerns. As used herein, “Site Content” includes the (i) photographs, videos, and other content available on the Service, (ii) any postings, submissions and profiles of registered members of the Service if they elect to make their postings, submissions and profiles public, (iii) any other software provided by or accessed through the Service, and (iv) any other content offered on or through the Service, including images, text, quotations, trademarks, logos, layout, design, interface, audio and video materials and stills.
                        </li>
                    <li>
                        When You post any PII on the Service, that posting will be stored on the Service. Please also note that if You post Your PII on the Service where it can be viewed by other visitors, Your PII becomes visible and available to those people.
                        </li>
                </ol>
                <p></p>
                <p>
                    <b>
                        By providing us with Your PII, You are representing that You are over 13 years of age and You are authorizing our use and disclosure of Your PII as described in this Policy and any subsequent revisions to this Policy that we may publish on the Service.<br />
                        Collection of NPII
                    </b>
                </p>
                <p></p>
                <p>
                    By providing us with Your PII, You are representing that You are over 13 years of age and You are authorizing our use and disclosure of Your PII as described in this Policy and any subsequent revisions to this Policy that we may publish on the Service.
            </p>
                <p>
                    In addition, certain NPII may be collected by TrendNine and our third-party advertising providers to monitor the usage of and to serve advertising to the Service that is targeted to You based on Your visits to the Service and other websites. Such information could include, by way of example, the number of times You view an advertisement but not PII relating to You. Certain of our third-party advertising providers are members of the Network Advertising Initiative (“NAI”), which offers a tool that allows You to “opt-out” of receiving targeted advertising from NAI members on websites using cookies, like ours. Learn more about the NAI and “opting-out” at:&nbsp;<a target="_blank" href="http://www.networkadvertising.org/choices/#completed">http://www.networkadvertising.org/choices/#completed</a>. Please note that opting out does not mean You will no longer receive any online advertising. You will still receive non-targeted ads when You’re online.
            </p>
                <p>
                    We may also share aggregated statistical NPII with third-parties, including our distributors, vendors, actual and potential customers and third-parties that offer products or services for use with the Service. This information is not linked to any PII.
            </p>
                <p>
                    NPII is typically collected through cookies, web beacons, or similar technologies. Cookies are pieces of information that the Service sends to Your device while You are visiting and using the Service. Web beacons allow us and our business partners to track Your activity on the Service but will not track activity off the Service. The Service does not currently recognize automated web browser tracking method signals, such as “do not track” instructions. You can change Your privacy preferences regarding the use of cookies and other technologies through Your browser, including blocking all cookies and disabling web beacons; however blocking all cookies may affect Your use of certain features of the Service and other websites and services online, and may prevent You from using all the features of our Service and other websites and services.
            </p>
                <p>
                </p><h5>Use of Information</h5>
                <p>
                    We, along with our Partners, may use the Information to:
                    </p><ol>
                    <li>
                        Manage your account
                        </li>
                    <li>
                        provide and communicate with you about the Services or your account with us,
                        </li>
                    <li>
                        fulfill your requests regarding the Services, including without limitation requests for newsletters and notifications,
                        </li>
                    <li>
                        respond to your inquiries, and notify you if you have won a contest,
                        </li>
                    <li>
                        communicate with you about other products, programs or services that we believe may be of interest to you, such as personalized offers, discounts, promotion codes, and events
                        </li>
                    <li>
                        enforce the legal terms (including without limitation our policies and terms of service) that govern your use of our Services, and/or for the purposes for which you provided the Information,
                        </li>
                    <li>
                        provide technical support for the Services,
                        </li>
                    <li>
                        prevent fraud or potentially illegal activities (including, without limitation, copyright infringement) on or through the Services,
                        </li>
                    <li>
                        protect the safety of our Users,
                        </li>
                    <li>
                        customize or personalize ads, offers and content made available to you based on your visits to and/or usage of the Services or other online or mobile websites, applications, platforms or services, and analyze the performance of those ads, offers and content, as well as your interaction with them,
                        </li>
                    <li>
                        perform analysis regarding how you use the Services or any part thereof,
                        </li>
                    <li>
                        send gifts, cards, invitations or emails if you use these services, to your designated recipients.
                        </li>
                </ol>
                <p></p>
                <p>
                    When you provide information from your social media account, it can help enable us to do things like (1) give you exclusive content, (2) personalize your online experience with us within and outside our Services, (3) contact you through the social media service or directly by sending you the latest news, special offerings, and rewards, and (4) enable you to share your experience and content via social media services. When you provide information about yourself to us through an application, through our Services, or on social media services or other third party platforms, it may be publicly viewed by other members of these services and we cannot prevent further use of the information by third parties.
                </p>
                <p>
                    We or a Partner may use “cookies” or similar technologies to associate certain of the Information with a unique identifier that then associates the Information with your device or browser. Sometimes, we may associate cookies with the Information, including de-identified, “hashed,” or anonymous versions of Information you have provided (such as during registration), in order to send or help our Partners send ads and offers based on your presumed interests or demographic information. We may combine any of the Information we collect, for any of the above purposes, and may sometimes enhance the Information with other information that we obtain from third party sources. Please also be aware if you register and create a profile with our Service, the username you select as well as other content you submit to your profile (e.g., photos, comments, video, reviews) will be displayed publicly on the Service, is searchable, can be found by third parties and may be reused and redistributed by us in our sole discretion. See our Terms of Use for details on our use of content you submit.
                </p>
                <p></p>
                <p>
                </p><h5>Use of Personally Identifiable Information</h5>
                <p>
                    TrendNine reserves the right to use Your PII: (1) for the specific purpose for which such information was provided; (2) for the purposes disclosed at the time such information is provided; or (3) as disclosed in this Policy. However, please note that, as described above, we may change this Policy at any time. Therefore additional uses of Your PII may be authorized in the future. You should check for updates to this Policy regularly in order to ensure You know how Your PII may be used and with whom it may be shared.
                </p>
                <p>
                    TrendNine may use Your PII to notify You about new features and other news and offers You may find valuable. You can opt out of these emails at the time You register or by following the "unsubscribe" instructions in any email. You can also unsubscribe any time You log into Your account by going to Your user profile and selecting the email opt-out button there. But please note that when You request to be notified of upcoming releases, You'll be automatically 'opted back in' so that we can send You the requested information.
                </p>
                <p>
                    TrendNine will not share Your PII with third parties (other than third parties we use to help provide and support the Service), except in the following circumstances:
                    </p><ol>
                    <li>
                        If You participate in certain activities through the Service (such as prize drawings), Your PII may be shared or otherwise disclosed, including when we announce contest winners and award prizes. The rules provided by TrendNine for these activities will inform You about these other uses of Your PII.
                        </li>
                    <li>
                        If TrendNine, or all or a portion of its business, is acquired by one or more third parties as a result of an acquisition, merger, sale, reorganization, or similar event, Your PII may be transferred to the third party as a result of that event.
                        </li>
                    <li>
                        TrendNine reserves the right to disclose Your PII when we believe that disclosure is necessary to protect our rights or the rights of other visitors, and/or to comply with a judicial or regulatory proceeding, court order, legal process, government request, or in similar circumstances.
                        </li>
                </ol>
                <p></p>
                <p></p>
                <p>
                </p><h5>Information Sharing and Disclosure</h5>
                <p>
                    We may disclose the Information as follows:
                    </p><ol>
                    <li>
                        To service providers or Partners that we have engaged to perform business-related functions on our behalf. This may include service providers that: (a) conduct research and analytics; (b) create content; (c) provide customer, technical or operational support; (d) conduct or support marketing (such as email or advertising platforms); (e) fulfill orders and user requests; (f) handle payments; (g) host our Services, forums and online communities; (h) administer contests; (i) maintain databases; (j) send or support online or mobile advertising; and (k) otherwise support our Services.
                        </li>
                    <li>
                        In response to a court order or a subpoena, a law enforcement or government agency's request or similar request.
                        </li>
                    <li>
                        With third parties in order to investigate, prevent, or take action (in our sole discretion) regarding potentially illegal activities, suspected fraud, situations involving potential threats to any person, us, or the Services, or violations of our policies, the law or our Terms of Use, to verify or enforce compliance with the policies governing our Services. We may transfer some or all of your Information if we, or one of our business units, undergoes a business transition, like a merger, acquisition by another company, or sale of all or part of our assets, or if a substantial portion of our or of a business unit’s assets is sold or merged in this way.
                        </li>
                    <li>
                        We may share the Information with affiliates, so they can provide, improve and communicate with you about their own, or their marketing partners’ products and services.
                        </li>
                    <li>
                        We may share the Information with unaffiliated Partners and third parties (e.g., our third party service providers, advertisers, advertising networks and platforms, agencies, other marketers, magazine publishers, retailers, participatory databases, and non-profit organizations) that wish to market products or services to you. If you wish to opt out from such sharing please visit the How to Contact Us/Opting Out of Marketing Communications section below for further instructions.
                        </li>
                </ol>
                <p></p>
                <p>
                    Please note that the Services covered by this Privacy Policy may offer content (e.g., contests, sweepstakes, promotions, games, applications, or social network integrations) that is sponsored by or co-branded with identified third parties. By virtue of these relationships, the third parties may obtain information from their visitors. We have no control over these third parties' use of this information, which is subject to their own privacy policies.
                </p>
                <p></p>
                <p>
                </p><h5>Cookies and Other User and Ad-Targeting Technologies.</h5>
                <p>
                    We use cookies and other technologies both to provide our Services to you and to advertise to you. We also may work with Partners to help them advertise to you when you visit other websites or mobile applications, and to help them perform user analytics. These technologies may also be used to analyze how our Users interact with advertising on our Services and elsewhere, and more generally, to learn more about our Users and what services or offers you might prefer to receive. We describe some of these technologies below.
                    </p><ol>
                    <li>
                        Cookies. To enhance your online experience, we and our Partners use "cookies", “web beacons” or other tracking technologies. Cookies are text files placed in your computer's browser to store your preferences. We use cookies or other tracking technologies to understand Service and Internet usage and to improve or customize the products, content, offerings, services or advertisements on our Services. For example, we may use cookies to personalize your experience at our Services (e.g., to recognize you by name when you return to a Service), save your password in password-protected areas, and enable you to use shopping carts on our Services. We also may use cookies or other tracking technologies to help us offer you products, content, offerings or services that may be of interest to you and to deliver relevant advertising when you visit this Service, an affiliate’s service, or when you visit other websites or applications. We or a third party platform with whom we work may place or recognize a unique cookie on your browser to enable you to receive customized content, offers, services or advertisements on our Services or other sites. These cookies contain no information intended to identify you personally. The cookies may be associated with de-identified demographic or other data linked to or derived from data you voluntarily have submitted to us (e.g., your email address) that we may share with a service provider solely in hashed, non-human readable form. We, our third party service providers, advertisers, advertising networks and platforms, agencies, or our Partners also may use cookies or other tracking technologies to manage and measure the performance of advertisements displayed on or delivered by or through our network and/or other networks or Services. This also helps us, our service providers and Partners provide more relevant advertising.
                        </li>
                    <li>
                        Syncing Cookies and Identifiers. We may work with our Partners (for instance, third party ad platforms) to synchronize unique, anonymous identifiers (such as those associated with cookies) in order to match our Partners’ uniquely coded user identifiers to our own. We may do this, for instance, to enhance data points about a particular unique browser or device, and thus enable us or others to send ads that are more relevant, match Users to their likely product interests, or better synchronize, cap, or optimize advertising.
                        </li>
                    <li>
                        Locally Stored Objects. Affiliated services may employ locally stored objects (“LSOs”) and other client side storage tracking technologies in certain situations where they help to provide a better user experience, such as to remember settings, preferences and usage similar to browser cookies, or in order to target or help our Partners target ads, analyze ad performance, or perform user, website or market analytics. For LSOs utilized by Adobe Flash you can access Flash management tools from Adobe’s website. In addition, some, but not all browsers, provide the ability to remove LSOs, sometimes within cookie and privacy settings.
                        </li>
                    <li>
                        Disabling Cookies. Most web browsers are set up to accept cookies. You may be able to set your browser to warn you before accepting certain cookies or to refuse certain cookies. However, if you disable the use of cookies in your web browser, some features of the Services may be difficult to use or inoperable. We may work with certain third-party companies that use techniques other than HTTP cookies to recognize your computer or device and/or to collect and record information about your web surfing activity, including those integrated with our Services. Please keep in mind that your web browser may not permit you to block the use of these techniques, and those browser settings that block conventional cookies may have no effect on such techniques.
                        </li>
                    <li>
                        Web Beacons. We and our Partners may also use "web beacons" or clear GIFs, or similar technologies, which are small pieces of code placed on a Service or in an email, to monitor the behavior and collect data about the visitors viewing a Service or email. For example, web beacons may be used to count the users who visit a web page or to deliver a cookie to the browser of a visitor viewing that Service. Web beacons may also be used to provide information on the effectiveness of our email campaigns (e.g., open rates, clicks, forwards, etc.).
                        </li>
                    <li>
                        Mobile Device Identifiers and SDKs. We also sometimes use, or partner with publishers, publisher-facing, or app developer platforms that use mobile Software Development Kits (“SDKs”), or use an SDK with a mobile app that we offer, to collect Information, such as mobile identifiers (e.g., IDFAs and Android Advertising IDs), and Information connected to how mobile devices interact with our Services and those using our Services. A mobile SDK is the mobile app version of a web beacon (see “Web Beacons” above). The SDK is a bit of computer code that app developers can include in their apps to enable ads to be shown, data to be collected, and related services or analytics to be performed. We may use this technology to deliver or help our Partners deliver certain advertising through mobile applications and browsers based on information associated with your mobile device. If you’d like to opt-out from having ads tailored to you in this way on your mobile device, please follow the instructions in the “Your Ad Choices” section below.
                        </li>
                </ol>
                <p></p>
                <p>
                    By visiting the Service, whether as a registered user or otherwise, you acknowledge, and agree that you are giving us your consent to track your activities and your use of the Service through the technologies described above, as well as similar technologies developed in the future, and that we may use such tracking technologies in the emails we send to you.
                </p>
                <p>
                    Our unaffiliated Partners and third parties may themselves set and access their own tracking technologies when you visit our Services and they may have access to information about you and your online activities over time and across different websites or applications when you use the Service. Their use of such tracking technologies is not in our control and is subject to their own privacy policies.
                </p>
                <p></p>
                <p>
                    <h5>Rights Applicable to EU Users</h5>
                    <p>Data Transfers</p>
                    <p>
                        If you are visiting from the European Union ("EU") or other regions with laws governing data collection and use that may differ from EU or United States law, please note that you may be transferring your Personal Information to the TrendNine Inc. in the United States and in other countries around the world for the purposes described under this Privacy Policy. We take great care in protecting your Personal Information and have put in place adequate mechanisms to protect it when it is transferred internationally.
                </p>
                    <p>
                        Legal basis for using your Personal Information
                </p>
                    <p>
                        If you are a visitor from the European Economic Area, our legal basis for collecting and using the Personal Information described above will depend on the Personal Information concerned and the specific context in which we collect it. For the European Economic Area, there are different legal bases that we rely on to use your Personal Information, namely:
                </p><ul>
                        <li>
                            Performance of a contract. The use of your Personal Information may be necessary to perform the terms and conditions or other policies under which we provide our Services.
                    </li>
                        <li>
                            Consent. We will rely on your consent to use (i) technical information such as cookie data and geolocation data; and (ii) your Personal Information for marketing purposes. You may withdraw your consent at any time by contacting us using the information at the end of this Privacy Policy or by following an unsubscribe link in any marketing communication you receive from us.
                    </li>
                        <li>
                            Legitimate interests. We may use your Personal Information for our legitimate interests to improve our Services, security purposes, and fraud prevention, and to share information with our affiliates for internal administration. In such circumstances it is for us to ensure that these interests are not overridden by your data protection interests or fundamental rights and freedoms. If we collect and use your Personal Information in reliance on our legitimate interests (or those of any third party), this interest will normally be for to operate our platform and communicating with you as necessary to provide our services to you and for our legitimate commercial interest, for instance, when responding to your queries, improving our platform, undertaking marketing, or for the purposes of detecting or preventing illegal activities. We may have other legitimate interests and if appropriate we will make clear to you at the relevant time what those legitimate interests are.
                    </li>
                    </ul>
                </p>
                <p>
                    <h5>Choices under EU law</h5>
                    <p>If your Personal Information is subject to the protections offered by EU law, you may:</p>
                    <ul>
                        <li>
                            Access, correct, update or request deletion of your Personal Information, at any time by contacting us using the contact details provided under the "Contact Us" section below;
                    </li>
                        <li>
                            Object to processing of your Personal Information, ask us to restrict processing of your Personal Information or request portability of your Personal Information;
                    </li>
                        <li>
                            Withdraw your consent at any time if we have collected and process your Personal Information with your consent;
                    </li>
                        <li>
                            Complain to a data protection authority about our collection and use of your Personal Information. For more information, please contact your local data protection authority. (Contact details for data protection authorities in the European Economic Area, Switzerland and certain non-European countries (including US and Canada) are available <a href="http://ec.europa.eu/justice/article-29/structure/data-protection-authorities/index_en.htm" target="_blank">here.</a>)
                    </li>
                    </ul>
                    <p>
                        To exercise any of these rights please contact us in accordance with the contact details set forth below. Please note that if you are not subject to EU law, these rights do not apply to you.
                </p>
                </p>
                <p>
                </p><h5>Other Important Information About Your Privacy</h5>
                <p>
                </p><ol>
                    <li>
                        Linked Services. TrendNine may provide links or pointers to the websites, services and software of certain third parties, such as Facebook, Instagram, Twitter, LinkedIn, and other media services and platforms whose information practices may be different than ours. Visitors should consult these other services' privacy notices as we have no control over information that is submitted to, or collected by, these third parties.&nbsp;<b>If You link to any of these third party websites, services or software, this Policy and the User Terms will not apply to Your use of those websites, services and software. We encourage You to read the legal notices posted on those websites and/or provided in connection with the third party products and services, including their privacy policies.</b>&nbsp;TrendNine shall have no responsibility or liability for Your experience with, and the data collection and use practices of, such third party websites, services and software. All inquiries concerning the privacy policies and terms of use of any third party website, service or software provider should be communicated to that third party. In addition, TrendNine makes no representation as to the quality, performance or content of (a) any such third party websites, services or software, or (b) any third party advertisements displayed on or through the Service. You acknowledge and agree that any access or use that You make of the same is at Your own risk and TrendNine has no responsibility or liability for damages or other costs, expenses or claims, of any kind and based on any theory of law or equity, including negligence, arising out of such access or use. Nothing in the fact that TrendNine provides links or pointers to any third party website, service or software, or allows You to access such websites, services or software from the Service, should be construed as an endorsement or representation by TrendNine with respect to such websites, services or software. Likewise, nothing in the fact that TrendNine displays third party advertising on the Service should be construed as an endorsement or representation by TrendNine with respect to the third party advertiser or the advertised products or services.
                        </li>
                    <li>
                        International Transfer, and Notice for Users Outside of the United States. You should be aware that the United States and other countries have not harmonized their privacy regulations. We have written this Policy to satisfy United States regulations. By using the Service, You agree to the level of privacy protection set out in this Policy.
                        </li>
                    <li>
                        Data Security. We have implemented technical, administrative and physical security measures to protect the information we collect, both PII and NPII, from unauthorized access and improper use. We keep that information on servers that are protected by firewalls and which we maintain or which are maintained by third parties under contract with us. From time to time, we review our security procedures in order to consider appropriate new technology and methods. Please be aware though, that, despite our reasonable efforts, no security measures are impenetrable and any connection You make with the Service or information You transmit to the Service will be at Your own risk.
                        </li>
                    <li>
                        How You Can Access or Correct Information. Access to certain personal Information that is collected from our Services and that we maintain may be available to you. For example, if you created a password-protected account within our Service, you can access that account to review the Information you provided.
                        </li>
                    <li>
                        Questions or Concerns. If you have any questions or concerns regarding TrendNine's policies or practices relating to privacy, or if you would like to opt out from our sharing of your personal Information with unaffiliated third parties for the third parties' direct marketing purposes you may contact our Privacy Policy Coordinator at privacy@TrendNine.com and request that we opt you out of such sharing. We may ask you to provide additional information for identity verification purposes, or to verify that you are in possession of an applicable email account.
                        </li>
                </ol>
                <p></p>
                <p></p>

                Updated as of: July 4, 2018
        </div>);
    };

    return (
        <div className={isMobile ? "static-content mobile-static-content" : "static-content"}>
            <PageNavigation />
            <BrowserView device={isBrowser}>
                <Sidebar>
                    <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;Privacy Policy
                </Sidebar>
                <Content>
                    {renderContent()}
                </Content>
            </BrowserView>
            <MobileView device={isMobile}>
                <div className="mobile-link-button">
                    <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;Privacy Policy
                </div>
                {renderContent()}
            </MobileView>
        </div>
    );
}

