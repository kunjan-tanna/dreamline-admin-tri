import React from "react";
import {
  Grid
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";
import classNames from "classnames";


function TermsAndConditions(props) {
  var classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <div className={classes.mainContainer}>
        <h3 className={classes.mainTitle}>TERMS AND CONDITIONS</h3>
        <p className={classes.welcomeText}>Welcome to Kulan!</p>
        <p>Kulan is owned and operated by Kulan LLC.</p>
        <p>These are the terms and conditions for: </p>
        <ul className={classes.mainList}>
          <li className={classes.normalBoldText}>Kulan (Android and iOS version – Available on Google Play store and App store).</li>
          <li><a href="https://kulan.app">https://kulan.app</a></li>
        </ul>
        <p>(Hereby Kulan).</p>
        <p>The use of the Kulan application, your registration as a user and the use of the services and functionalities, mean that you accept these terms and conditions set out below.</p>
        <p className={classes.normalCapitalText}>PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE ACCESSING, REGISTERING, DOWNLOADING, USING OR OBTAINING ANY MATERIALS, INFORMATION OR SERVICES FROM THE APPLICATION.</p>

        <h3 className={classes.subTitle}>ACCEPTANCE OF TERMS</h3>
        <p>This agreement sets forth legally binding terms for your use of Kulan app. By registering and using the application, you agree to be bound by this agreement. If you do not accept the terms of this agreement, you should not download the application and discontinue use of the service immediately. We may modify this agreement from time to time, and such modification shall be effective upon its posting on Kulan app. You agree to be bound by any modification to this terms and conditions when you use Kulan after any such modification is posted; it is therefore important that you review this agreement regularly.</p>
        <p>You represent and warrant that all registration information you submit is accurate and truthful; and that your use of the platform does not violate any applicable law or regulation. </p>
        <p>Kulan may, in its sole discretion, refuse to offer the services to any entity and change its eligibility criteria at any time. This provision is void where prohibited by law and the right to access the service and the platform is revoked in such jurisdictions.</p>

        <h3 className={classes.subTitle}>ELIGIBLITY</h3>
        <p>Users may use the application and services only if they can form a binding contract with Kulan, and only in compliance with these terms and all applicable local, state, national and international laws, rules and regulations.</p>
        <p>The registration and use of the services available in the application is limited to the legal age of majority according to the applicable and valid regulations. If the user does not meet the legal age permitted under applicable laws, the use of the application and services is strictly prohibited. </p>
        <p><span className={classes.normalCapitalText}>KULAN'S SERVICES ARE STRICTLY FORBIDDEN TO PERSONS UNDER 18 YEARS OF AGE.</span> Kulan reserves the right to make appropriate checks during registration.</p>
        <p>By using the application and services, you represent and warrant that you have the full right, power and authority to enter into this agreement and to perform fully all of your obligations hereunder. You further represent and warrant that you are not under any legal incapacity or contractual restriction that prevents you from entering into this agreement.</p>

        <h3 className={classes.subTitle}>USERS</h3>
        <p>Kulan understands "users" to mean people who download the application and/or access and register as users to use the application's functionality to search for and connect with other Somali users.</p>
        <p>If you wish to register as a user you must read this agreement and indicate your acceptance during the registration process. In consideration of your use of the platform, you represent that you are 18 years of age or older and are of legal age to form a binding contract under applicable law and jurisdiction. The user agrees to adhere to this agreement and everything contained in it, and further agrees to (a) Provide true, accurate, current and complete information about you, as requested on the registration form available on Kulan. (b) Maintain and update your registration data to keep it true, accurate, current and complete. If we have reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, Kulan reserves the right to suspend or terminate your account and refuse any and all current or future use of the service (or any portion thereof) at any time.</p>
        <p>Kulan hereby grants users a limited, terminable and non-exclusive right to access and use the application for entertainment purposes. You may not assign, sell, transfer or lease any of the services purchased with Kulan to any third party without Kulan's express written permission. Kulan reserves the right to suspend or terminate your access and use at any time if we determine that users are in violation of these terms and conditions.</p>

        <h3 className={classes.subTitle}>ACCOUNT OPENING AND REGISTRATION</h3>
        <p>To access and use the services available in the application, you must first create an account and choose a password. Users must provide a truthful and accurate description, about their hobbies, location, interests, etc., for the sole purpose of facilitating Kulan to search for profiles with similar hobbies and interests, close to their location.</p>
        <p>Users must undergo a verification process to confirm and ensure the veracity of the information and verify that the data corresponds to a real person. User verification will be tested by the "Verified User" symbol on the profile.</p>
        <p>You must always provide accurate, current and complete information. Kulan has the right to rely on contact and other information provided to us through your account. Your account is non-transferable. You may not share your password with anyone. You are responsible for maintaining the confidentiality of your password and account information, and are fully responsible for all activities that occur under your password or account. You agree to immediately notify Kulan of any unauthorized use of your password or account or any other breach of security, and to ensure that you exit from your account at the end of each session. You may never use another user's account without Kulan's prior authorization.</p>
        <p>You can control your profile and the way you interact with the service by changing your account settings. By providing Kulan with your email address you consent and authorize us to use your email address to send you notifications related to Kulan, including any notifications required by law. We may also use your e-mail address to send you other messages, such as changes to service features and special offers. If you do not wish to receive such e-mails, you may send us your request via the contact information.</p>

        <h3 className={classes.subTitle}>ACCOUNT DELETION AND TERMINATION</h3>
        <p>Users can cancel their accounts at any time, for any reason, by following Kulan's instructions. Such termination will only result in the deletion of the account and the removal of all personal data granted to Kulan. </p>
        <p>Kulan reserves the right to terminate your account or your access to it immediately, with or without notice and without liability, if Kulan believes that you have violated any of these terms, registered with false or misleading information or interfered with the use of the application and the site or services by other users.</p>
        <p>Kulan reserves the right to delete any profile that is deemed to be false, misleading or not belonging to a real person who cannot be verified, without prior notice.</p>

        <h3 className={classes.subTitle}>SERVICE RULES</h3>
        <p>Communications and possible appointments between users must comply with the following rules:</p>
        <ul className={classes.mainList}>
          <li>The application is designed by Somalis for Somalis. Avoid using the application if you do not have the same interests.</li>
          <li>Members must be 18 years of age or older.</li>
          <li>Public places are highly recommended.</li>
          <li>Harassment is totally prohibited.</li>
          <li>Offensive, inappropriate, hateful, threatening and obscene language is prohibited.</li>
        </ul>
        <p>Kulan reserves the right to terminate the accounts and profiles of users who have violated these terms and rules, without any prior notice.</p>

        <h3 className={classes.subTitle}>FUNCTION "REPORT PROFILE”</h3>
        <p>Users will have the "Report Profile" function available if they feel that the reported user is violating the rules and terms and conditions described in this document. Kulan will evaluate the reports and make a decision according to the violations committed by the reported user. The "Report Profile" function helps to create a healthy and safe environment for users and should be used with full responsibility and restraint.</p>
        <p>Users will also be able to block any user of their choice from their profiles. Blocked users will no longer be able to access that user's profile or communicate with the user.</p>

        <h3 className={classes.subTitle}>MEMBERSHIPS</h3>
        <p>The use of the platform is completely free. The user has the possibility to access a preferred membership that allows the user to access special features of the application, including monthly payments.</p>
        <p>By purchasing a membership, the user agrees to purchase the membership for the price advertised on the website, according to the features offered on the website. Please check the price and features of the membership before making a purchase.</p>
        <p>When a user places an order for a membership, Kulan will send an email to confirm that the order has been received. This email confirmation will automatically occur so that the user has confirmation of the membership details. The membership will be active for monthly or annual periods and will show the next billing date.</p>
        <p>Kulan may cancel any sale and not supply memberships if it is reasonable to do so and may change or discontinue the availability of memberships at any time in its sole discretion. This does not affect your statutory rights.</p>
        <p>Memberships include automatic recurring payments. You authorize Kulan to renew your membership and to be charged periodically and progressively each month on the membership billing date. The membership billing date is the date you make the first payment. Your account will be automatically charged on the membership billing date with all applicable fees for the next membership period. The membership will continue until you cancel your membership or we terminate it. You must cancel your membership before it renews to avoid billing the next periodic membership fee to your account. We will bill the recurring membership fee to the payment method you provide during registration and the corresponding charge will be automatically debited from your credit card, debit card or bank account.</p>
        <p>Memberships will automatically renew for an additional period unless you cancel your membership before the next billing date. Cancelled memberships will immediately lose access to payment features.</p>

        <h3 className={classes.subTitle}>PRICES</h3>
        <p>Kulan reserves the right to determine the membership prices. Kulan will make reasonable efforts to keep the pricing information published on the application up to date. We encourage you to check our application periodically for updated pricing information. Kulan may change the fees for any membership or service, including any additional charges or fees. Kulan, at its sole discretion, may make promotional offers with different features and different prices to any Kulan user.</p>

        <h3 className={classes.subTitle}>PAYMENTS</h3>
        <p>Subscriptions will be paid through “Stripe”, “PayPal” and “Apple Pay” (payment platform available at Kulan). Users will be able to make payments for the membership through invoices sent to the user's email address in each billing period. The payment will be charged to your credit card, debit card or PayPal account immediately after the order of the membership you have purchased. When processing a transaction, we will issue an electronic transaction receipt that will be sent to the email address you provide. Your payment information will be treated and safeguarded securely and for the sole purpose of processing the purchase of the memberships. Kulan reserves the right to contract any payment platform available in the market, which will process your data for the exclusive purpose of processing the purchase of the memberships.</p>

        <h3 className={classes.subTitle}>DISCLAIMER</h3>
        <p>Kulan only provides users with a virtual space that allows them to communicate using the application and use the functionalities available in the application. </p>
        <p>Kulan services are limited only to facilitate communication between registered users with the same interests (Somalis). The communications established by the users in the application are the sole responsibility of the users themselves. Kulan does not accept any claim or demand from users for commercial or personal relationships arising from communications established by users in Kulan.</p>
        <p>Kulan is not responsible for any theft, loss or damage caused to the physical or moral integrity of users during appointments or communications established in the application. The user is responsible for the meetings, appointments, relationships and communications that users establish through Kulan. </p>
        <p>Kulan is not responsible for damages to the physical or moral integrity of persons, such as injuries, death or any other physical and moral damages such as threats, insults and slander that may fall on a person, as a result of the communications established in Kulan. Communications and relationships established between users as a result of any connection within the application are the sole and exclusive responsibility of the users. We encourage you to be cautious and to take precautions when meeting or communicating with other users.</p>
        <p>In case one or more users or any third party initiates any kind of legal, judicial or administrative claim or action against one or more other users, each and every user involved in such claim or action releases Kulan from any liability.</p>

        <h3 className={classes.subTitle}>LICENSE TO USE THE PLATFORM</h3>
        <p>Kulan gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you by Kulan as part of the services. This license is for the sole purpose of enabling you to use and enjoy the benefit of the services as provided by Kulan, in the manner permitted by these terms. You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract the source code of that software, unless laws prohibit those restrictions or you have our written permission.</p>
        <p>The user agrees not to use the platform and the services negligently, for fraudulent purposes or in an unlawful manner. Likewise, the user agrees not to partake in any conduct or action that could damage the image, interests or rights of the Kulan application or third parties.</p>
        <p>This service prohibits sending of messages, that: (1) Any kind of messages that are catalogued as SPAM. (2) Are harassing, abusive, defamatory, obscene, in bad faith, unethical or otherwise illegal content (3) distribute trojans, viruses or other malicious computer software (4) Are intending to commit fraud, impersonating other persons, phishing, scams, or related crime (5) distribute intellectual property without ownership or a license to distribute such property (6) Breach, in any way, the terms of service, privacy policy or rules of this web site or the recipients.</p>
        <p className={classes.normalBoldText}>Kulan reserves the right to terminate your access immediately, with or without notice, and without liability to you, if Kulan believes that you have violated any of these terms or interfered with the use of the application or service by others.</p>

        <h3 className={classes.subTitle}>THIRD-PARTY MATERIALS.</h3>
        <p>“Third-Party Materials” means any content, images, videos, texts or other material that is owned by a third party, such as stock images, videos and texts. Such Third-Party Materials are subject to the applicable third-party terms and licenses, and may only be used as permitted by such terms and licenses.</p>

        <h3 className={classes.subTitle}>COPYRIGHT</h3>
        <p>All content included on this application, such as text, graphics, logos, button icons, images, video, audio clips, data compilation, and software, is the property of Kulan, its merchants, or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Kulan and protected by international copyright laws. All software used on this site is the property of Kulan or its software suppliers and protected by international copyright laws.</p>
        <p>You have no authorization to copy, transmit, distribute, display, republish, post, or upload from our application in any way without our prior written approval, or stated otherwise on our site. You may print a copy of our site's content strictly for personal use only. By doing so, you also consent not to directly or indirectly change or remove any copyright, trade name, service mark, trademark, or any other proprietaries shown on any of our content. Any alterations or use of content outside the guidelines of this Terms and Conditions violates intellectual property rights. By accessing our application, you do not own any rights or titles to our content or other intellectual properties.</p>

        <h3 className={classes.subTitle}>USER CONTENT</h3>
        <p>Certain features of the application may allow users to upload content that may consist of messages, text, images and other general content and to publish such user content to the application. Users retain any copyrights they may have in the content that they upload and post to the application. However, we do need some permission from the user to publish the content. By uploading and publishing your content to the application, you authorize Kulan to publish such content to the application. By providing content through the services available on the application, you grant Kulan, a worldwide, non-exclusive, royalty-free, fully paid license to host, store, transfer, display, reproduce and distribute your user content, in whole or in part on the application for the sole and exclusive purpose of providing the functionalities of the application.</p>

        <h3 className={classes.subTitle}>USER CONTENT REPRESENTATIONS AND WARRANTIES</h3>
        <p>Kulan disclaims any and all liability in connection with user content. You are solely responsible for your user content and the consequences of providing user content via the service. By providing user content via the Service, you affirm, represent, and warrant that:</p>
        <ol type="a" className={classes.mainList}>
          <li>You are the creator and owner of the user content, or have the necessary licenses, rights, consents, and permissions to authorize Kulan and users of the service to use and distribute your user content as necessary to exercise the licenses granted by you in this Section, in the manner contemplated by Kulan, the service, and these Terms.</li>
          <li>Your user content, and the use of your user content as contemplated by these terms, does not and will not: (i) infringe, violate, or misappropriate any third party right, including any copyright, trademark, patent, trade secret, moral right, privacy right, right of publicity, or any other intellectual property or proprietary right; (ii) slander, defame, libel, or invade the right of privacy, publicity or other property rights of any other person; or (iii) cause  Kulan to violate any law or regulation.</li>
          <li>Your user content could not be deemed by a reasonable person to be objectionable, profane, indecent, pornographic, harassing, threatening, embarrassing, hateful, or otherwise inappropriate.</li>
          <li>Your user content does not and will not contain Hateful Content, a Threat of Physical Harm, or Harassment.</li>
        </ol>

        <h3 className={classes.subTitle}>REVIEW AND CONTROL OF USER CONTENT</h3>
        <p>We are not obligated to edit or control the user content that you or other users post or edit, and we are not in any way responsible for the user content. However, Kulan may, at any time and without notice, review, remove, edit or block any user content that we believe violates these Terms or is otherwise objectionable. You understand that, by using the service, you will be exposed to user content from a variety of sources and acknowledge that user content may be inaccurate, offensive, indecent or objectionable. You agree to waive, and relinquish, any legal or equitable rights or remedies you have or may have against Kulan with respect to User Content. If a user or content owner is notified by a user or content owner that user content allegedly does not comply with these Terms, we may investigate the allegation and determine in our sole discretion whether to remove the user content, which we reserve the right to do at any time and without notice. For clarity, Kulan does not allow copyright infringing activities on the service.</p>
        <p>You acknowledge and agree that Kulan reserves the right to, and without prior notice, monitor any and all information transmitted or received through the service for operational and other purposes. If at any time Kulan chooses to monitor content, Kulan does not assume any responsibility for reviewing such content. During the review of the content, the information may be examined, recorded, copied and used in accordance with our Privacy Policy.</p>

        <h3 className={classes.subTitle}>ACCURACY AND TIMELINESS OF INFORMATION</h3>
        <p>We do not guarantee that the information available on the application is accurate, complete or updated. The content of this application is provided for general information. Any use of the material provided on this application is at your own risk. </p>

        <h3 className={classes.subTitle}>PROHIBITED ACTIVITIES</h3>
        <p>The content and information available on the application (including, but not limited to, data, information, text, music, sound, photos, graphics, video, maps, icons or other material), as well as the infrastructure used to provide such Content and information, is proprietary to  Kulan or licensed to the Kulan by third parties. For all content other than your content, you agree not to otherwise modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell or re-sell any information, software or services obtained from or through the application. Additionally, you agree not to:</p>
        <ol type="i" className={classes.mainList}>
          <li>Use the services or content for any commercial purpose, outside the scope of those commercial purposes explicitly permitted under this agreement and related guidelines as made available by Kulan;</li>
          <li>Access, monitor, reproduce, distribute, transmit, broadcast, display, sell, license, copy or otherwise exploit any Content of the Services, including but not limited to, using any robot, spider, scraper or other automated means or any manual process for any purpose not in accordance with this Agreement or without our express written permission;</li>
          <li>Violate the restrictions in any robot exclusion headers on the Services or bypass or circumvent other measures employed to prevent or limit access to the Services;</li>
          <li>Take any action that imposes, or may impose, in our discretion, an unreasonable or disproportionately large load on our infrastructure;</li>
          <li>Deep-link to any portion of the services for any purpose without our express written permission;</li>
          <li>"Frame", "mirror" or otherwise incorporate any part of the services into any other websites or service without our prior written authorization;</li>
          <li>Attempt to modify, translate, adapt, edit, decompile, disassemble, or reverse engineer any software programs used by Kulan in connection with the services;</li>
          <li>Circumvent, disable or otherwise interfere with security-related features of the Services or features that prevent or restrict use or copying of any content; or</li>
          <li>Download any Content unless it’s expressly made available for download by Kulan.</li>
        </ol>

        <h3 className={classes.subTitle}>KULAN RESPONSIBILITIES</h3>
        <p>Because of the nature of the Internet Kulan provides and maintains the application on an "as is", "as available" basis and makes no promise that use of the application will be uninterrupted or entirely error free. We are not responsible to you if we are unable to provide our Internet services for any reason beyond our control.</p>
        <p>Our application may from time to time contain links to other web sites which are not under the control of and are not maintained by us. These links are provided for your convenience only and we are not responsible for the content of those sites.</p>
        <p>Except as provided above we can give no other warranties, conditions or other terms, express or implied, statutory or otherwise and all such terms are hereby excluded to the maximum extent permitted by law.</p>
        <p>You will be responsible for any breach of these terms by you and if you use the application in breach of these terms you will be liable to and will reimburse, Kulan for any loss or damage caused as a result.</p>
        <p>These terms above shall not limit any rights you might have as a consumer that may not be excluded under applicable law nor shall they exclude or limit Kulan liability for death or personal injury resulting from its negligence nor any fraudulent representation.</p>
        <p>Kulan will not be liable in any amount for failure to perform any obligation under this agreement if such failure is caused by the occurrence of any unforeseen event beyond its reasonable control including without limitation Internet outages, communications outages, fire, flood, war or act of God.</p>
        <p>These terms do not affect your statutory rights as a consumer which are available to you.</p>
        <p>Subject as aforesaid, to the maximum extent permitted by law, Kulan excludes liability for any loss or damage of any kind howsoever arising, including without limitation any direct, indirect or consequential loss whether or not such arises out of any problem you notify to Kulan and Kulan shall have no liability to pay any money by way of compensation, including without limitation all liability in relation to:</p>
        <ul className={classes.mainList}>
          <li>Any incorrect or inaccurate information on Kulan application.</li>
          <li>Members must be 18 years of age or older.The infringement by any person of any Intellectual Property Rights of any third party caused by their use of the application or any product purchased through the application.</li>
          <li>Any loss or damage resulting from your use or the inability to use the web site or resulting from unauthorized access to, or alteration of your transmissions or data in circumstances which are beyond our control.</li>
          <li>Any loss of profit, wasted expenditure, corruption or destruction of data or any other loss which does not directly result from something we have done wrong.</li>
          <li>Any amount or kind of loss or damage due to viruses or other malicious software that may infect a user's computer equipment, software, data or other property caused by persons accessing or using content from the application, or from transmissions via emails or attachments received from Kulan.</li>
          <li>All representations, warranties, conditions and other terms which but for this notice would have effect.</li>
        </ul>

        <h3 className={classes.subTitle}>NON-COMMERCIAL USE</h3>
        <p>The services and the application cannot be used in connection with any commercial purpose, except when specifically approved by Kulan. Commercial advertisements, affiliate links and other forms of commercial content without prior notice may result in termination or suspension of services and user account.</p>

        <h3 className={classes.subTitle}>ELECTRONIC COMMUNICATIONS</h3>
        <p>Kulan shall not accept any liability for failed, partial or garbled computer transmissions, for any malfunction, failure, poor connection, availability of computer hardware or software, phones, cables, networks, electronic or Internet devices, acts or omissions of any service provider, Internet accessibility or availability or for traffic congestion or unauthorized human acts, including errors or failures.</p>

        <h3 className={classes.subTitle}>INDEMNIFICATION</h3>
        <p>You agree to defend and indemnify Kulan and any of their directors, employees and agents from and against any claims, causes of action, demands, recoveries, losses, damages, fines, penalties or other costs or expenses of any kind or nature including but not limited to reasonable legal and accounting fees, brought by third parties as a result of:</p>
        <ul className={classes.mainList}>
          <li>Your breach of this Agreement or the documents referenced herein.</li>
          <li>Your violation of any law or the rights of a third party.</li>
          <li>Your use on the Kulan application.</li>
        </ul>

        <h3 className={classes.subTitle}>CHANGES AND TERMINATION</h3>
        <p>We may change the application and these Terms at any time, in our sole discretion and without notice to you. You are responsible for remaining knowledgeable about these Terms. Your continued use of the application constitutes your acceptance of any changes to these Terms and any changes will supersede all previous versions of the Terms. Unless otherwise specified herein, all changes to these Terms apply to all users take effect. Furthermore, we may terminate this agreement with you under these Terms at any time by notifying you in writing (including by email) or without any warning.</p>

        <h3 className={classes.subTitle}>PERSONAL DATA</h3>
        <p>When you download the application and/or access the site and register as a Kulan user, you agree that we may collect and store your personal information. (See our Privacy Policy).</p>

        <h3 className={classes.subTitle}>INTEGRATION CLAUSE</h3>
        <p>This agreement together with the Privacy Policy and any other legal notices published by Kulan, shall constitute the entire agreement between you and Kulan concerning and governs your use of the application.</p>

        <h3 className={classes.subTitle}>DISPUTES</h3>
        <p>You agree that any dispute, claim or controversy arising out of or relating to these Terms or the breach, termination, application, interpretation, or validity of these Terms or the use of the Kulan app shall be settled by binding arbitration between you and Kulan, except that each party retains the right to bring an individual action in court and the right to seek injunctive or other equitable relief in a court of competent jurisdiction.</p>

        <h3 className={classes.subTitle}>HEADINGS</h3>
        <p>Headings are for reference purposes only and in no way define, limit, construe or describe the scope or extent of such section. Our failure to act with respect to a breach by you or others does not waive our right to act with respect to subsequent or similar breaches. These terms set forth the entire understanding and agreement between us with respect to the subject matter therein.</p>

        <h3 className={classes.subTitle}>FINAL PROVISIONS</h3>
        <p>These terms are governed by the USA law. Use of our application is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms.</p>
        <p>Our performance of these Terms is subject to existing laws and legal process, and nothing contained in these Terms limits our right to comply with law enforcement or other governmental or legal requests or requirements relating to your use of our application or information provided to or gathered by us with respect to such use.</p>
        <p>If any part of these Terms is found to be invalid, illegal or unenforceable, the validity, legality and enforceability of the remaining provisions will not in any way be affected or impaired. Our failure or delay in enforcing any provision of these Terms at any time does not waive our right to enforce the same or any other provision(s) hereof in the future.</p>
        <p>Any rights not expressly granted herein are reserved.</p>

        <h3 className={classes.subTitle}>CONTACT INFORMATION</h3>
        <p>If you have questions or concerns about these terms and services, please contact us at:</p>
        <p className={classes.normalBoldText}>Email: info@kulan.app</p>
      </div>
    </Grid>
  );
}

export default withRouter(TermsAndConditions);
