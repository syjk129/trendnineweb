import * as React from "react";

import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { LinkButton } from "../../components/button";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import PageNavigation from "../flowComponents/pageNavigation";

export default function TermsAndConditions() {
    const pathname = location.pathname;
    const isShop = pathname.indexOf("/shop") > -1;
    const prevPage = isShop ? "Shop" : "Discover";
    const prevPageUrl = isShop ? "/shop" : "/";
    const renderContent = () => {
        return (
            <div>
                <h3>Terms of Use</h3>
                <p>
                    By accessing or using the TrendNine website, the TrendNine service, or any applications (including mobile applications) made available by TrendNine (together, the "Service"), however accessed, you agree to be bound by these terms of use ("Terms of Use"). The Service is owned or controlled by TrendNine, Inc. (”TrendNine"). These Terms of Use affect your legal rights and obligations. If you do not agree to be bound by all of these Terms of Use, do not access or use the Service.
                </p>
                <p>
                    There may be times when we offer a special feature that has its own terms and conditions that apply in addition to these Terms of Use. In those cases, the terms specific to the special feature control to the extent there is a conflict with these Terms of Use.
                </p>
                <p>
                    The TrendNine Terms of Use define how You may use the Service. The TrendNine Terms of Use can be found&nbsp;here&nbsp;and are incorporated into this Policy by reference. Therefore, by agreeing to this Policy, you agree that your engagement with and use of the Service are governed by the Terms of Use in effect at the time of your use.
                </p>
                <p>
                    ARBITRATION NOTICE: EXCEPT IF YOU OPT-OUT AND EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN THE ARBITRATION SECTION BELOW, YOU AGREE THAT DISPUTES BETWEEN YOU AND TrendNine WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
                </p>

                <p>
                </p><h5>Basic Terms</h5>
                <ol>
                    <li>
                        You must be at least 13 years old to use the Service.
                        </li>
                    <li>
                        You may not post violent, nude, discriminatory, unlawful, infringing, hateful, pornographic, or sexually suggestive photos or other content via the Service.
                        </li>
                    <li>
                        You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights. With the exception of people or businesses that are expressly authorized to create accounts on behalf of their employers or clients, TrendNine prohibits the creation of and you agree that you will not create an account for anyone other than yourself. You also represent that all information you provide or provided to TrendNine upon registration and at all other times will be true, accurate, current and complete and you agree to update your information as necessary to maintain its truth and accuracy.
                        </li>
                    <li>
                        You agree that you will not solicit, collect or use the login credentials of other TrendNine users.
                        </li>
                    <li>
                        You are responsible for keeping your password secret and secure.
                        </li>
                    <li>
                        You must not defame, stalk, bully, abuse, harass, threaten, impersonate or intimidate people or entities and you must not post private or confidential information via the Service, including, without limitation, your or any other person's banking, credit card, or other similar financial account information, social security or alternate national identity numbers, non-public phone numbers or non-public email addresses.
                        </li>
                    <li>
                        You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules and regulations (for example, federal, state, local and provincial) applicable to your use of the Service and your Content (defined below), including but not limited to, copyright laws.
                        </li>
                    <li>
                        You are solely responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials (collectively, "Content") that you submit, post or display on or via the Service. “Content” also includes all information, data, text, graphics, photographs, content, and other materials on your Instagram account and blog at the URL identified at application, and you are deemed to have submitted such Content for inclusion on our Service. You agree that you are solely responsible for all of your Content and that any such Content is considered both non-confidential and non-proprietary.
                        </li>
                    <li>
                        You must not change, modify, adapt or alter the Service or change, modify or alter another website so as to falsely imply that it is associated with the Service or TrendNine.
                        </li>
                    <li>
                        You must not access TrendNine’s private API by means other than those permitted by TrendNine.
                        </li>
                    <li>
                        You must not create or submit unwanted email, comments, likes or other forms of commercial or harassing communications (also known as "spam") to any TrendNine users.
                        </li>
                    <li>
                        You must not use domain names or web URLs in your username without prior written consent from TrendNine.
                        </li>
                    <li>
                        You must not interfere or disrupt the Service or servers or networks connected to the Service, including by transmitting any worms, viruses, spyware, malware or any other code of a destructive or disruptive nature. You may not inject content or code or otherwise alter or interfere with the way any TrendNine page is rendered or displayed in a user's browser or device.
                        </li>
                    <li>
                        You must not create accounts with the Service through unauthorized means, including but not limited to, by using an automated device, script, bot, spider, crawler or scraper.
                        </li>
                    <li>
                        You must not attempt to restrict another user from using or enjoying the Service and you must not encourage or facilitate violations of these Terms of Use or any other TrendNine terms.
                        </li>
                    <li>
                        Violation of these Terms of Use may, in TrendNine’s sole discretion, result in termination of your TrendNine account. You understand and agree that TrendNine cannot and will not be responsible for the Content posted on the Service and you use the Service at your own risk. If you violate the letter or spirit of these Terms of Use, or otherwise create risk or possible legal exposure for TrendNine, we can stop providing all or part of the Service to you.
                        </li>
                </ol>
                <p></p>
                <p>
                </p><h5>General Conditions</h5>
                <ol>
                    <li>
                        We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you. If we terminate your access to the Service or deactivate your account, your photos, comments, likes, friendships, and all other data will no longer be accessible through your account (e.g., users will not be able to navigate to your username and view your photos), but those materials and data may persist and appear within the Service (e.g., if your Content has been reshared by others).
                            </li>
                    <li>
                        Upon termination, all licenses and other rights granted to you in these Terms of Use will immediately cease.
                            </li>
                    <li>
                        We reserve the right, in our sole discretion, to change these Terms of Use ("Updated Terms") from time to time. Unless we make a change for legal or administrative reasons, we will provide reasonable advance notice before the Updated Terms become effective. You agree that we may notify you of the Updated Terms by posting them on the Service, and that your use of the Service after the effective date of the Updated Terms (or engaging in such other conduct as we may reasonably specify) constitutes your agreement to the Updated Terms. Therefore, you should review these Terms of Use and any Updated Terms before using the Service. The Updated Terms will be effective as of the time of posting, or such later date as may be specified in the Updated Terms, and will apply to your use of the Service from that point forward. These Terms of Use will govern any disputes arising before the effective date of the Updated Terms.
                            </li>
                    <li>
                        We reserve the right to refuse access to the Service to anyone for any reason at any time.</li>
                    <li>
                        We reserve the right to force forfeiture of any username for any reason.</li>
                    <li>
                        We may, but have no obligation to, remove, edit, block, and/or monitor Content or accounts containing Content that we determine in our sole discretion violates these Terms of Use.</li>
                    <li>
                        You are solely responsible for your interaction with other users of the Service, whether online or offline. You agree that TrendNine is not responsible or liable for the conduct of any user. TrendNine reserves the right, but has no obligation, to monitor or become involved in disputes between you and other users.</li>
                    <li>
                        There may be links from the Service, or from communications you receive from the Service, to third-party web sites or features. There may also be links to third-party web sites or features in images or comments within the Service. The Service also includes third-party content that we do not control, maintain or endorse. Functionality on the Service may also permit interactions between the Service and a third-party web site or feature, including applications that connect the Service or your profile on the Service with a third-party web site or feature. For example, the Service may include a feature that enables you to share Content from the Service or your Content with a third party, which may be publicly posted on that third party's service or application. Using this functionality typically requires you to login to your account on the third-party service and you do so at your own risk. TrendNine does not control any of these third-party web services or any of their content. You expressly acknowledge and agree that TrendNine is in no way responsible or liable for any such third-party services or features. YOUR CORRESPONDENCE AND BUSINESS DEALINGS WITH THIRD PARTIES FOUND THROUGH THE SERVICE ARE SOLELY BETWEEN YOU AND THE THIRD PARTY. You may choose, at your sole and absolute discretion and risk, to use applications that connect the Service or your profile on the Service with a third-party service (each, an "Application") and such Application may interact with, connect to or gather and/or pull information from and to your Service profile. By using such Applications, you acknowledge and agree to the following: (i) if you use an Application to share information, you are consenting to information about your profile on the Service being shared; (ii) your use of an Application may cause personally identifying information to be publicly disclosed and/or associated with you, even if TrendNine has not itself provided such information; and (iii) your use of an Application is at your own option and risk, and you will hold the TrendNine Parties (defined below) harmless for activity related to the Application.</li>
                    <li>
                        You agree that you are responsible for all data charges you incur through use of the Service.</li>
                    <li>
                        We prohibit crawling, scraping, caching or otherwise accessing any content on the Service via automated means, including but not limited to, user profiles and photos (except as may be the result of standard search engine protocols or technologies used by a search engine with TrendNine’s express consent).</li>
                </ol>
                <p></p>
                <p></p>
                <p>
                </p><h5>Account Registration</h5>
                <p>
                    In order to register, you are required to provide your username, email address and password. You are also able to add a profile picture and bio, and add user preferences.
                    </p>
                <p>All personal details disclosed by you on the Services will be collected and processed in accordance with our <a href="/privacy" target="_blank">Privacy Policy.</a> You warrant that all the information you provide to us is accurate and complete.</p>
                <p>
                    You agree to register with TrendNine and use your account solely for personal use. You may not authorize others to use your account.
                    </p>
                <p>
                    You are solely responsible for keeping your registration and other personal details (including your username and password) for your account confidential.
                    </p>
                <p>
                    You shall promptly notify TrendNine of any actual or suspected unauthorized third party access to your account. You shall cooperate with, and assist, us in any action or proceedings by us to prevent or otherwise deal with any unauthorized receipt, access or use of your account by any third party.
                    </p><p>
                    You warrant that all registration information and personal details provided to TrendNine is true and accurate.
                    </p><p>
                    Facebook Connect
                    </p><p>
                    You can also register using Facebook Connect, which allows you to register with TrendNine via your Facebook account. If you decide to do this, you give us permission to access basic information from your Facebook account. This information is collected by Facebook and is provided to us under the terms of Facebook’s privacy policy. We have no control over individual account privacy settings on such services or policies on how your personal information will be used. You and Facebook are in control of these matters, not us. Before using these features, you are encouraged to read all policies and information on Facebook to learn more about how they handle your information.
                    </p>
                <p>TrendNine is not responsible for any acts or omissions by Facebook and any connected social media service providers' use of features that come from Facebook's platform.</p>
                <p>
                </p><h5>Buying Products Through TrendNine</h5>
                <p>
                    TrendNine is an online intermediary which partners with third party brands to give you a wide array of fashion items to purchase.
                    </p>
                <p>
                    When you select a particular product that you wish to buy, you will be taken directly to the third party TrendNine merchant (the "TrendNine Partner") website and asked to provide further personal details, which are likely to include your billing and delivery address, and payment card details. You are being taken here because that TrendNine Partner is not part of our Integrated Checkout service, which may still be in development. The personal details you enter on these TrendNine Partner websites will be collected, stored and processed in accordance with the terms and conditions and privacy policy of these websites. You must read and accept the terms and conditions and privacy and cookie policies of the TrendNine Partner website before purchasing your items from them. TrendNine is not responsible for the terms and conditions, privacy policies of and/or practices on other sites. The TrendNine Partners are solely responsible for any and all issues related to products and services offered on their websites, including but not limited to issues arising from the processing of your transactions on the TrendNine Partner websites. We are only responsible for personal information collected on the Services.
                    </p>
                <p>
                    <h5>Rights Applicable to TrendNine Influencers</h5>
                </p><ol>
                    <li>
                        TrendNine does not claim ownership of any Content that you post on or through the Service. Instead, you hereby grant to TrendNine a non-exclusive, fully paid and royalty-free, transferable, sub-licensable, worldwide license to:
                                <ul>
                            <li>
                                Use, exploit, distribute, reproduce, modify, adapt, tag, publish, translate, publicly perform, and publicly display any Content (or any modification thereto), in whole or in part, in any format or medium now known or later developed;
                                    </li>
                            <li>
                                Use (and permit others to use) Content (either posted on the Service or any other site/blog you own and/or operate) in any manner and for any purpose (including, without limitation, commercial purposes) that we deem appropriate in our sole discretion (including, without limitation, to incorporate Content or any modification thereto, in whole or in part, into any technology, product, or service);
                                    </li>
                            <li>
                                Display advertisements in connection with Content and to use Content for advertising and promotional purposes. The manner, mode and extent of such advertising and promotions are subject to change without specific notice to you;
                                    </li>
                            <li>
                                Have the option, but not the obligation, to pre-screen Content or monitor any area of the Service through which Content may be submitted. We are not required to host, display, or distribute any Content on or through the Service and may remove at any time or refuse any Content for any reason (including, without limitation, filtering objectionable material, removing offensive content, and blocking abusive users from the service). We are not responsible for any loss, theft, or damage of any kind to any Content.
                                    </li>
                        </ul>
                    </li>
                    <li>
                        You acknowledge that we may not always identify paid services, sponsored content, or commercial communications as such.
                            </li>
                    <li>
                        You represent and warrant that: (i) you own the Content posted by you on or through the Service or otherwise have the right to grant the rights and licenses set forth in these Terms of Use; (ii) the posting and use of your Content on or through the Service does not violate, misappropriate or infringe on the rights of any third party, including, without limitation, privacy rights, publicity rights, copyrights, trademark and/or other intellectual property rights; (iii) you agree to pay for all royalties, fees, and any other monies owed by reason of Content you post on or through the Service; and (iv) you have the legal right and capacity to enter into these Terms of Use in your jurisdiction.
                            </li>
                    <li>
                        The Service contains content owned or licensed by TrendNine (”TrendNine Content"). TrendNine Content is protected by copyright, trademark, patent, trade secret and other laws, and, as between you and TrendNine, TrendNine owns and retains all rights in the TrendNine Content and the Service. You will not remove, alter or conceal any copyright, trademark, service mark or other proprietary rights notices incorporated in or accompanying the TrendNine Content and you will not reproduce, modify, adapt, prepare derivative works based on, perform, display, publish, distribute, transmit, broadcast, sell, license or otherwise exploit the TrendNine Content.
                            </li>
                    <li>
                        The TrendNine name and logo are trademarks of TrendNine, and may not be copied, imitated or used, in whole or in part, without the prior written permission of TrendNine. In addition, all page headers, custom graphics, button icons and scripts are service marks, trademarks and/or trade dress of TrendNine, and may not be copied, imitated or used, in whole or in part, without prior written permission from TrendNine.
                            </li>
                    <li>
                        Although it is TrendNine’s intention for the Service to be available as much as possible, there will be occasions when the Service may be interrupted, including, without limitation, for scheduled maintenance or upgrades, for emergency repairs, or due to failure of telecommunications links and/or equipment. Also, TrendNine reserves the right to remove any Content from the Service for any reason, without prior notice. Content removed from the Service may continue to be stored by TrendNine, including, without limitation, in order to comply with certain legal obligations, but may not be retrievable without a valid court order. Consequently, TrendNine encourages you to maintain your own backup of your Content. In other words, TrendNine is not a backup service and you agree that you will not rely on the Service for the purposes of Content backup or storage. TrendNine will not be liable to you for any modification, suspension, or discontinuation of the Services, or the loss of any Content. You also acknowledge that the Internet may be subject to breaches of security and that the submission of Content or other information may not be secure.
                            </li>
                    <li>
                        You agree that TrendNine is not responsible for, and does not endorse, Content posted within the Service. TrendNine does not have any obligation to prescreen, monitor, edit, or remove any Content. If your Content violates these Terms of Use, you may bear legal responsibility for that Content.
                            </li>
                    <li>
                        Except as otherwise described in the Service's Privacy Policy, as between you and TrendNine, any Content will be non-confidential and non-proprietary and we will not be liable for any use or disclosure of Content. You acknowledge and agree that your relationship with TrendNine is not a confidential, fiduciary, or other type of special relationship, and that your decision to submit any Content does not place TrendNine in a position that is any different from the position held by members of the general public, including with regard to your Content. None of your Content will be subject to any obligation of confidence on the part of TrendNine, and TrendNine will not be liable for any use or disclosure of any Content you provide.
                            </li>
                    <li>
                        It is TrendNine’s policy not to accept or consider content, information, ideas, suggestions or other materials other than those we have specifically requested and to which certain specific terms, conditions and requirements may apply. This is to avoid any misunderstandings if your ideas are similar to those we have developed or are developing independently. Accordingly, TrendNine does not accept unsolicited materials or ideas, and takes no responsibility for any materials or ideas so transmitted. If, despite our policy, you choose to send us content, information, ideas, suggestions, or other materials, you further agree that TrendNine is free to use any such content, information, ideas, suggestions or other materials, for any purposes whatsoever, including, without limitation, developing and marketing products and services, without any liability or payment of any kind to you.
                            </li>
                </ol>
                <p></p>
                <p></p>
                <p>
                </p><h5>Reporting Copyright and Other IP Violations</h5>
                <p>
                    We respect other people's rights, and expect you to do the same. If you repeatedly infringe other people's intellectual property rights, we will disable your account when appropriate.
                        </p>
                <p></p>
                <p>
                    Please note that the Services covered by this Privacy Policy may offer content (e.g., contests, sweepstakes, promotions, games, applications, or social network integrations) that is sponsored by or co-branded with identified third parties. By virtue of these relationships, the third parties may obtain information from their visitors. We have no control over these third parties' use of this information, which is subject to their own privacy policies.
                    </p>
                <p></p>
                <p>
                </p><h5>Disclaimer of Warranties</h5>
                <p>
                    THE SERVICE, INCLUDING, WITHOUT LIMITATION, TrendNine CONTENT, IS PROVIDED ON AN "AS IS", "AS AVAILABLE" AND "WITH ALL FAULTS" BASIS. TO THE FULLEST EXTENT PERMISSIBLE BY LAW, NEITHER TrendNine NOR ANY OF THEIR EMPLOYEES, MANAGERS, OFFICERS OR AGENTS (COLLECTIVELY, THE " TrendNine PARTIES") MAKE ANY REPRESENTATIONS OR WARRANTIES OR ENDORSEMENTS OF ANY KIND WHATSOEVER, EXPRESS OR IMPLIED, AS TO: (A) THE SERVICE; (B) THE TrendNine CONTENT; (C) USER CONTENT; OR (D) SECURITY ASSOCIATED WITH THE TRANSMISSION OF INFORMATION TO TrendNine OR VIA THE SERVICE. IN ADDITION, THE TrendNine PARTIES HEREBY DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, TITLE, CUSTOM, TRADE, QUIET ENJOYMENT, SYSTEM INTEGRATION AND FREEDOM FROM COMPUTER VIRUS.
                        </p>
                <p>THE TrendNine PARTIES DO NOT REPRESENT OR WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED; THAT DEFECTS WILL BE CORRECTED; OR THAT THE SERVICE OR THE SERVER THAT MAKES THE SERVICE AVAILABLE IS FREE FROM ANY HARMFUL COMPONENTS, INCLUDING, WITHOUT LIMITATION, VIRUSES. THE TrendNine PARTIES DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES THAT THE INFORMATION (INCLUDING ANY INSTRUCTIONS) ON THE SERVICE IS ACCURATE, COMPLETE, OR USEFUL. YOU ACKNOWLEDGE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE TrendNine PARTIES DO NOT WARRANT THAT YOUR USE OF THE SERVICE IS LAWFUL IN ANY PARTICULAR JURISDICTION, AND THE TrendNine PARTIES SPECIFICALLY DISCLAIM SUCH WARRANTIES. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER WARRANTIES SO THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU TO THE EXTENT SUCH JURISDICTION'S LAW IS APPLICABLE TO YOU AND THESE TERMS OF USE.</p>
                <p>
                    BY ACCESSING OR USING THE SERVICE YOU REPRESENT AND WARRANT THAT YOUR ACTIVITIES ARE LAWFUL IN EVERY JURISDICTION WHERE YOU ACCESS OR USE THE SERVICE.
                    </p>
                <p>
                    THE TrendNine PARTIES DO NOT ENDORSE CONTENT AND SPECIFICALLY DISCLAIM ANY RESPONSIBILITY OR LIABILITY TO ANY PERSON OR ENTITY FOR ANY LOSS, DAMAGE (WHETHER ACTUAL, CONSEQUENTIAL, PUNITIVE OR OTHERWISE), INJURY, CLAIM, LIABILITY OR OTHER CAUSE OF ANY KIND OR CHARACTER BASED UPON OR RESULTING FROM ANY CONTENT.
                    </p>
                <p></p>
                <p>
                </p><h5>Limitation of Liability; Waiver</h5>
                <p>
                    UNDER NO CIRCUMSTANCES WILL THE TrendNine PARTIES BE LIABLE TO YOU FOR ANY LOSS OR DAMAGES OF ANY KIND (INCLUDING, WITHOUT LIMITATION, FOR ANY DIRECT, INDIRECT, ECONOMIC, EXEMPLARY, SPECIAL, PUNITIVE, INCIDENTAL OR CONSEQUENTIAL LOSSES OR DAMAGES) THAT ARE DIRECTLY OR INDIRECTLY RELATED TO: (A) THE SERVICE; (B) THE TrendNine CONTENT; (C) USER CONTENT; (D) YOUR USE OF, INABILITY TO USE, OR THE PERFORMANCE OF THE SERVICE; (E) ANY ACTION TAKEN IN CONNECTION WITH AN INVESTIGATION BY THE TrendNine PARTIES OR LAW ENFORCEMENT AUTHORITIES REGARDING YOUR OR ANY OTHER PARTY'S USE OF THE SERVICE; (F) ANY ACTION TAKEN IN CONNECTION WITH COPYRIGHT OR OTHER INTELLECTUAL PROPERTY OWNERS; (G) ANY ERRORS OR OMISSIONS IN THE SERVICE'S OPERATION; OR (H) ANY DAMAGE TO ANY USER'S COMPUTER, MOBILE DEVICE, OR OTHER EQUIPMENT OR TECHNOLOGY INCLUDING, WITHOUT LIMITATION, DAMAGE FROM ANY SECURITY BREACH OR FROM ANY VIRUS, BUGS, TAMPERING, FRAUD, ERROR, OMISSION, INTERRUPTION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER LINE OR NETWORK FAILURE OR ANY OTHER TECHNICAL OR OTHER MALFUNCTION, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOST PROFITS, LOSS OF GOODWILL, LOSS OF DATA, WORK STOPPAGE, ACCURACY OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION, EVEN IF FORESEEABLE OR EVEN IF THE TrendNine PARTIES HAVE BEEN ADVISED OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, STRICT LIABILITY OR TORT (INCLUDING, WITHOUT LIMITATION, WHETHER CAUSED IN WHOLE OR IN PART BY NEGLIGENCE, ACTS OF GOD, TELECOMMUNICATIONS FAILURE, OR THEFT OR DESTRUCTION OF THE SERVICE). IN NO EVENT WILL THE TrendNine PARTIES BE LIABLE TO YOU OR ANYONE ELSE FOR LOSS, DAMAGE OR INJURY, INCLUDING, WITHOUT LIMITATION, DEATH OR PERSONAL INJURY. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU. IN NO EVENT WILL THE TrendNine PARTIES TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES OR CAUSES OR ACTION EXCEED ONE HUNDRED UNITED STATES DOLLARS ($100.00).
                    </p>
                <p>THAT ARISE OUT OF TRENDNINE’S ACTS OR OMISSIONS, THE DAMAGES, IF ANY, CAUSED TO YOU ARE NOT IRREPARABLE OR SUFFICIENT TO ENTITLE YOU TO AN INJUNCTION PREVENTING ANY EXPLOITATION OF ANY WEB SITE, SERVICE, PROPERTY, PRODUCT OR OTHER CONTENT OWNED OR CONTROLLED BY THE TrendNine PARTIES, AND YOU WILL HAVE NO RIGHTS TO ENJOIN OR RESTRAIN THE DEVELOPMENT, PRODUCTION, DISTRIBUTION, ADVERTISING, EXHIBITION OR EXPLOITATION OF ANY WEB SITE, PROPERTY, PRODUCT, SERVICE, OR OTHER CONTENT OWNED OR CONTROLLED BY THE TrendNine PARTIES.</p>
                <p>BY ACCESSING THE SERVICE, YOU UNDERSTAND THAT YOU MAY BE WAIVING RIGHTS WITH RESPECT TO CLAIMS THAT ARE AT THIS TIME UNKNOWN OR UNSUSPECTED, AND IN ACCORDANCE WITH SUCH WAIVER, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND, AND HEREBY EXPRESSLY WAIVE, THE BENEFITS OF SECTION 1542 OF THE CIVIL CODE OF CALIFORNIA, AND ANY SIMILAR LAW OF ANY STATE OR TERRITORY, WHICH PROVIDES AS FOLLOWS: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR."</p>
                <p>TrendNine IS NOT RESPONSIBLE FOR THE ACTIONS, CONTENT, INFORMATION, OR DATA OF THIRD PARTIES, AND YOU RELEASE US, OUR DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS FROM ANY CLAIMS AND DAMAGES, KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH ANY CLAIM YOU HAVE AGAINST ANY SUCH THIRD PARTIES.</p>
                <p></p>
                <p>
                </p><h5>Indemnification</h5>
                <p>
                    You (and also any third party for whom you operate an account or activity on the Service) agree to defend (at TrendNine’s request), indemnify and hold the TrendNine Parties harmless from and against any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable attorney's fees and costs, arising out of or in any way connected with any of the following (including as a result of your direct activities on the Service or those conducted on your behalf): (i) your Content or your access to or use of the Service; (ii) your breach or alleged breach of these Terms of Use; (iii) your violation of any third-party right, including without limitation, any intellectual property right, publicity, confidentiality, property or privacy right; (iv) your violation of any laws, rules, regulations, codes, statutes, ordinances or orders of any governmental and quasi-governmental authorities, including, without limitation, all regulatory, administrative and legislative authorities; or (v) any misrepresentation made by you. You will cooperate as fully required by TrendNine in the defense of any claim. TrendNine reserves the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you will not in any event settle any claim without the prior written consent of TrendNine.
                    </p>
                <p></p>

                <p>
                </p><h5>Arbitration</h5>
                <p>
                    Except if you opt-out or for disputes relating to: (1) your or TrendNine’s intellectual property (such as trademarks, trade dress, domain names, trade secrets, copyrights and patents); (2) violations of the API Terms; or (3) violations of provisions 13 or 15 of the Basic Terms, above ("Excluded Disputes"), you agree that all disputes between you and TrendNine (whether or not such dispute involves a third party) with regard to your relationship with TrendNine, including without limitation disputes related to these Terms of Use, your use of the Service, and/or rights of privacy and/or publicity, will be resolved by binding, individual arbitration under the American Arbitration Association's rules for arbitration of consumer-related disputes and you and TrendNine hereby expressly waive trial by jury. As an alternative, you may bring your claim in your local "small claims" court, if permitted by that small claims court's rules. You may bring claims only on your own behalf. Neither you nor TrendNine will participate in a class action or class-wide arbitration for any claims covered by this agreement. You also agree not to participate in claims brought in a private attorney general or representative capacity, or consolidated claims involving another person's account, if TrendNine is a party to the proceeding. This dispute resolution provision will be governed by the Federal Arbitration Act. In the event the American Arbitration Association is unwilling or unable to set a hearing date within one hundred and sixty (160) days of filing the case, then either TrendNine or you can elect to have the arbitration administered instead by the Judicial Arbitration and Mediation Services. Judgment on the award rendered by the arbitrator may be entered in any court having competent jurisdiction. Any provision of applicable law notwithstanding, the arbitrator will not have authority to award damages, remedies or awards that conflict with these Terms of Use.
                    </p>
                <p>If the prohibition against class actions and other claims brought on behalf of third parties contained above is found to be unenforceable, then all of the preceding language in this Arbitration section will be null and void. This arbitration agreement will survive the termination of your relationship with TrendNine.</p>
                <p></p>
                <p>
                </p><h5>Time Limitation on Claims</h5>
                <p>
                    You agree that any claim you may have arising out of or related to your relationship with TrendNine must be filed within one year after such claim arose; otherwise, your claim is permanently barred.
                    </p>
                <p></p>
                <p>
                </p><h5>Governing Law &amp; Venue</h5>
                <p>
                    These Terms of Use are governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law AND WILL SPECIFICALLY NOT BE GOVERNED BY THE UNITED NATIONS CONVENTIONS ON CONTRACTS FOR THE INTERNATIONAL SALE OF GOODS, IF OTHERWISE APPLICABLE. For any action at law or in equity relating to the arbitration provision of these Terms of Use, the Excluded Disputes or if you opt out of the agreement to arbitrate, you agree to resolve any dispute you have with TrendNine exclusively in a state or federal court located in Santa Clara, California, and to submit to the personal jurisdiction of the courts located in Santa Clara County for the purpose of litigating all such disputes.
                    </p>
                <p>
                    If any provision of these Terms of Use is held to be unlawful, void, or for any reason unenforceable during arbitration or by a court of competent jurisdiction, then that provision will be deemed severable from these Terms of Use and will not affect the validity and enforceability of any remaining provisions. TrendNine’s failure to insist upon or enforce strict performance of any provision of these Terms will not be construed as a waiver of any provision or right. No waiver of any of these Terms will be deemed a further or continuing waiver of such term or condition or any other term or condition. TrendNine reserves the right to change this dispute resolution provision, but any such changes will not apply to disputes arising before the effective date of the amendment. This dispute resolution provision will survive the termination of any or all of your transactions with TrendNine.
                    </p>
                <p></p>
                <p>
                </p><h5>Entire Agreement</h5>
                <p>
                    If you are using the Service on behalf of a legal entity, you represent that you are authorized to enter into an agreement on behalf of that legal entity. These Terms of Use constitute the entire agreement between you and TrendNine and governs your use of the Service, unless any prior agreements were made between you and TrendNine. You will not assign the Terms of Use or assign any rights or delegate any obligations hereunder, in whole or in part, whether voluntarily or by operation of law, without the prior written consent of TrendNine. Any purported assignment or delegation by you without the appropriate prior written consent of TrendNine will be null and void. TrendNine may assign these Terms of Use or any rights hereunder without your consent. If any provision of these Terms of Use is found by a court of competent jurisdiction to be invalid or otherwise unenforceable, the parties nevertheless agree that such portion will be deemed severable from these Terms of Use and will not affect the validity and enforceability of the remaining provisions, and the remaining provisions of the Terms of Use remain in full force and effect. Neither the course of conduct between the parties nor trade practice will act to modify the Terms of Use. These Terms of Use do not confer any third-party beneficiary rights.
                    </p>
                <p></p>
                <p>
                </p><h5>Territorial Restrictions</h5>
                <p>
                    The information provided within the Service is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject Instagram to any registration requirement within such jurisdiction or country. We reserve the right to limit the availability of the Service or any portion of the Service, to any person, geographic area, or jurisdiction, at any time and in our sole discretion, and to limit the quantities of any content, program, product, service or other feature that Instagram provides.
                    </p>
                <p>
                    Software related to or made available by the Service may be subject to United States export controls. Thus, no software from the Service may be downloaded, exported or re-exported: (a) into (or to a national or resident of) any country to which the United States has embargoed goods; or (b) to anyone on the U.S. Treasury Department's list of Specially Designated Nationals or the U.S. Commerce Department's Table of Deny Orders. By downloading any software related to the Service, you represent and warrant that you are not located in, under the control of, or a national or resident of, any such country or on any such list.
                    </p>
                <p>
                    The effective date of these Terms of Use is June 18, 2018. These Terms of Use were written in English (US). To the extent any translated version of these Terms of Use conflicts with the English version, the English version controls.
                    </p>
                <p></p>

                Updated as of: July 4, 2018

            </div>
        );
    };

    return (
        <div className={isMobile ? "static-content mobile-static-content" : "static-content"}>
            <PageNavigation />
            <BrowserView viewClassName="flex" device={isBrowser}>
                <Sidebar>
                    <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;Terms &amp; Conditions
                </Sidebar>
                <Content>
                    {renderContent()}
                </Content>
            </BrowserView>
            <MobileView device={isMobile}>
            <div className="mobile-link-button">
                <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;Terms &amp; Conditions
            </div>
            {renderContent()}
            </MobileView>
        </div>
    );
}

