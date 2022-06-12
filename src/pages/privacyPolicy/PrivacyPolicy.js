import React from "react";
import {
  Grid
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";
import classNames from "classnames";


function PrivacyPolicy(props) {
  var classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <div className={classes.mainContainer}>
        <h3 className={classes.mainTitle}>PRIVACY POLICY</h3>
        <p className={classes.welcomeText}>Welcome to Kulan!</p>
        <p>Kulan is owned and operated by Kulan LLC.</p>
        <p>Kulan values your privacy. This notice describes what information we collect, how we use it, and, if necessary, those with whom we share it.</p>
        <p>By registering on the platform, using the services, buying the membership, using the application, you are accepting the practices described in this Privacy Policy. Your use of the services is also subject to our Terms and Conditions.</p>
        <p>This Privacy Policy may change from time to time. Your continued use of the application and services after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates. This Privacy Policy has been developed and is maintained in accordance with all applicable federal and international laws and regulations and specifically with the California Online Privacy Protection Act (CalOPPA – U.S regulation) and the GDPR (General Data Protection Regulation - European regulation).</p>

        <h3 className={classes.subTitle}>GENERAL INFORMATION</h3>
        <p>The personal data of the users that are collected and processed through the website:</p>
        <ul className={classes.mainList}>
          <li className={classes.normalBoldText}>Kulan (Android and iOS version – Available on Google Play store and App store).</li>
          <li><a href="https://kulan.app">https://kulan.app</a></li>
        </ul>
        <p>Will be under responsibility and in charge of:</p>
        <p className={classNames(
          classes.normalBoldText,
          classes.paragraphMargin
        )}>Kulan LLC</p>
        <p className={classNames(
          classes.normalBoldText,
          classes.paragraphMargin
        )}>Email: info@kulan.app</p>
        <p className={classNames(
          classes.normalBoldText,
          classes.paragraphMargin
        )}>Phone: +948 256 347 968</p>
        <p>(Hereinafter referred to as “<span className={classes.normalBoldText}>Kulan</span>”).</p>

        <h3 className={classes.subTitle}>TYPES OF INFORMATION GATHERED</h3>
        <p>The information we learn from customers helps personalize and continually improve your experience at Kulan. Here are the types of information we gather:</p>
        <p><span className={classes.normalBoldText}>Information You Give Us.</span> You provide information when you search, read and watch the content, register as a user, use the application, purchase a membership or communicate with us. As a result of those actions, you might supply us with the following information:</p>
        <ul className={classes.mainList}>
          <li>First and last name</li>
          <li>Profile Photos</li>
          <li>Age and date of birth</li>
          <li>Email address</li>
          <li>Phone number (includes WhatsApp)</li>
          <li>Hobbies and interests</li>
          <li>Address and zip code</li>
          <li>GPS information (location)</li>
          <li>Payment information</li>
          <li>IP address</li>
          <li>Any additional information relating to you that you provide to us directly through our websites or indirectly through our websites or online presence such as ‘cookies’.</li>
        </ul>
        <p>Kulan will not collect any personally identifiable information about you, unless you provide it.</p>
        <p><span className={classes.normalBoldText}>Payment information:</span> Payment information: Your credit card information or payment information, will be processed by “PayPal”, “Stripe” and “Apple Pay” (payment platforms) which will treat and safeguard your data with total security and with the exclusive purpose of processing the purchase of the memberships. Bella Hope London reserves the right to contract any payment platform available in the market, which treats your data for the exclusive purpose of processing the purchase of the memberships.</p>
        <p>Please consult PayPal, Stripe and Apple Pay privacy policy here:</p>
        <p><a href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full">https://www.paypal.com/us/webapps/mpp/ua/privacy-full</a></p>
        <p><a href="https://stripe.com/gb/privacy">https://stripe.com/gb/privacy</a></p>
        <p><a href="https://support.apple.com/en-us/HT203027">https://support.apple.com/en-us/HT203027</a></p>
        <p><span className={classes.normalBoldText}>Location information (GPS):</span> by downloading and using the application you authorize Kulan to use the GPS system integrated in the user's phone for the sole and exclusive purpose of providing the appropriate searches of user profiles, according to the user's location. The location information and the GPS system will be used only for the proper functioning of the application and its functionality.</p>
        <p><span className={classes.normalBoldText}>GOOGLE Analytics:</span> We use Google Analytics provided by Google, Inc., USA (“Google”). These tool and technologies collect and analyze certain types of information, including IP addresses, device and software identifiers, referring and exit URLs, feature use metrics and statistics, usage and purchase history, media access control address (MAC Address), mobile unique device identifiers, and other similar information via the use of cookies. The information generated by Google Analytics (including your IP address) may be transmitted to and stored by Google on servers in the United States. We use the GOOGLE Analytics collection of data to enhance the website and platform and improve our service.</p>
        <p>Please consult Google's privacy policy here:</p>
        <p><a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>
        <p><span className={classes.normalBoldText}>Facebook Pixel:</span> Our platform uses Facebook pixels that enable us, our advertisers and service providers:</p>
        <ul className={classes.mainList}>
          <li>Collect statistics on our platforms and social networks (for example, number of users who visited a page).</li>
          <li>Collect information about how you interact with our platforms and social networks (e.g., whether you opened or followed links contained within).</li>
          <li>Personalize online services and marketing communications.</li>
          <li>Match ads to users and optimize advertising campaigns.</li>
        </ul>
        <p>Please consult Facebook's privacy policy here:</p>
        <p><a href="https://www.facebook.com/privacy/explanation">https://www.facebook.com/privacy/explanation</a></p>
        <p><span className={classes.normalBoldText}>Automatic Information:</span> Like many websites, we use "cookies." We obtain certain types of anonymous information which is not personally identifiable when your web browser accesses Kulan or third-party content served by or on behalf of Kulan on other websites. Some of the information we collect and analyze includes the Internet protocol (IP) address; computer and connection information such as browser type, version, and connection speed; purchase history; and the content you searched for, viewed, and possibly purchased.</p>

        <h3 className={classes.subTitle}>HOW LONG WE KEEP YOUR DATA</h3>
        <p>The personal data will be kept for the time necessary to provide the services, the functionalities of the applications, the sale of the memberships or as long as the user does not withdraw his consent or his account is closed or deleted. The user's personal data will be deleted from our database immediately after the user withdraws his consent or his account is deleted. Kulan may be permitted to retain personal data for a longer period, provided that the user has given his or her consent to such processing and provided that such consent is not withdrawn. In addition, Kulan may be required to retain personal data for a longer period if this is necessary to fulfill a legal obligation or by order of an authority. After the retention period has expired, the personal data will be deleted. Therefore, the right of access, the right of deletion, the right of rectification and the right of preservation of the data cannot be enforced after the expiration of the retention period. </p>

        <h3 className={classes.subTitle}>HOW WE USE YOUR INFORMATION</h3>
        <p>In general, we use the information we collect primarily to provide, maintain, protect and improve our current platform and services and to develop new services. We use personal information collected through our site as described below and described elsewhere in this Policy to:</p>
        <ul className={classes.mainList}>
          <li>Identify you as a user in our system.</li>
          <li>Users registration.</li>
          <li>Provide the memberships.</li>
          <li>Process payments.</li>
          <li>Facilitate communication between users (chat platform).</li>
          <li>Provide the applications and the functionalities of the applications.</li>
          <li>Improve our services, website, and how we operate our business.</li>
          <li>Understand and enhance your experience using our website and services.</li>
          <li>Send emails through bulk email delivery platforms such as MailChimp and Klaviyo.</li>
          <li>Communicate with you through our support team.</li>
          <li>Send you related information, including confirmations, invoices, technical notices, updates, security alerts and support and administrative messages.</li>
          <li>Communicate with you about upcoming events and news about products and services offered by Kulan.</li>
          <li>Marketing purposes of Kulan.</li>
          <li>Link or combine your information with other information we get from third parties to help understand your needs and provide you with better service.</li>
          <li>Protect, investigate and deter against fraudulent, unauthorized or illegal activity.</li>
        </ul>

        <h3 className={classes.subTitle}>HOW DO YOU GET MY CONSENT?</h3>
        <p>By registering, using the platform, buying a membership and providing us with personal information to communicate with you, you agree that we collect and use your information. You can withdraw your consent, contact us through the contact information or the contact page.</p>

        <h3 className={classes.subTitle}>SOCIAL NETWORKS</h3>
        <p>On our website you will find links and functions linked to different social networks, in which you can share your information.</p>
        <p>It is advisable to consult the privacy policy and data protection of each social network used on our website.</p>
        <p>Facebook: <a href="https://www.facebook.com/privacy/explanation">https://www.facebook.com/privacy/explanation</a></p>
        <p>Instagram: <a href="http://instagram.com/about/legal/privacy/">http://instagram.com/about/legal/privacy/</a></p>
        <p>Twitter: <a href="https://twitter.com/privacy">https://twitter.com/privacy</a></p>

        <h3 className={classes.subTitle}>HOW WE SHARE INFORMATION</h3>
        <p>Information about our customers is an important part of our business, and we are not in the business of selling it to others. We share customer information only as described below.</p>
        <p><span className={classes.normalBoldText}>Third-Party Service Providers:</span> We employ other companies and individuals to perform functions on our behalf. Examples include process payments (PayPal, Stripe, Apple Pay), sending email, analyzing data, providing marketing assistance, providing search results and links. They have access to personal information needed to perform their functions, but may not use it for other purposes.</p>
        <p><span className={classes.normalBoldText}>Business Transfers:</span> In the event that Kulan creates, merges with, or is acquired by another entity, your information will most likely be transferred. Kulan will email you or place a prominent notice on our Website before your information becomes subject to another privacy policy.</p>
        <p><span className={classes.normalBoldText}>Protection of Kulan and others:</span> We release personal information when we believe release is appropriate to comply with the law, enforce or apply our Terms and conditions and other agreements, or protect the rights, property, or safety of Kulan, our users or others. This includes exchanging information with other companies and organizations for fraud protection and credit risk reduction.</p>
        <p><span className={classes.normalBoldText}>With Your Consent:</span> Other than as set out above, you will receive notice when personally identifiable information about you might go to third parties, and you will have an opportunity to choose not to share the information.</p>
        <p><span className={classes.normalBoldText}>Anonymous Information:</span> Kulan uses the anonymous browsing information collected automatically by our servers primarily to help us administer and improve the platform and website. We may also use aggregated anonymous information to provide information about the website to potential business partners and other unaffiliated entities. This information is not personally identifiable.</p>
        <p><span className={classes.normalBoldText}>Email Address:</span> The email address that you supply to us for purposes of receiving our email communications will never be rented or sold to a third party.</p>

        <h3 className={classes.subTitle}>PROTECTING YOUR INFORMATION</h3>
        <p>We work to protect the security of your information during transmission by using Secure Sockets Layer (SSL) software, which encrypts information you input. If transactions are processed on the Website, transaction information is transmitted to and from the Website in encrypted form using industry-standard SSL connections to help protect such information from interception. We restrict authorized access to your personal information to those persons who have a legitimate purpose to know that information to provide products or services to you and those persons you have authorized to have access to such information.</p>
        <p>Kulan follows generally accepted industry standards to protect the personal information submitted to us, both during transmission and once Kulan receives it. No method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, while Kulan strives to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. </p>
        <p>We will not sell, distribute, or lease your personal information to third parties unless we have your permission or are required by law to do so.</p>

        <h3 className={classes.subTitle}>YOUR RIGHTS</h3>
        <p>You have the following rights in relation to your personal data provided to Kulan:</p>
        <ul className={classes.mainList}>
          <li>Access your personal data.</li>
          <li>Request the correction of inaccurate data.</li>
          <li>Request its deletion.</li>
          <li>Request limitation of the processing of your data.</li>
          <li>Oppose the treatment of your data.</li>
          <li>Request your portability.</li>
          <li>Not be subject to automated individual decisions.</li>
        </ul>
        <p>The users can exercise all these rights contacting us through the contact information or the contact page.</p>
        <p>Without preconception to any other administrative appeal or legal action, the user shall have the right to submit a claim to a control authority, in particular in the State in which he or she has their habitual residence, place of work or place of the alleged infringement, If you consider that the processing of your personal data is not appropriate to the regulations, as well as in the case of not seeing the exercise of your rights satisfied. The control authority in which the claim was filed will inform the claimant about the course and result of the claim.</p>

        <h3 className={classes.subTitle}>EU MEMBERS’ RIGHTS (GDPR COMPLIANT)</h3>
        <p>If you are habitually located in the European Union, you have the right to access, rectify, download or erase your information, as well as the right to restrict and object to certain processing of your information. While some of these rights apply generally, certain rights apply only in certain limited circumstances.</p>
        <p>We describe these rights below:</p>
        <ul className={classes.mainList}>
          <li>Access and Porting: You can access your information at any time.</li>
          <li>Rectify, Restrict, Limit, Delete: You can also rectify, restrict, limit or delete much of your information by contact us. </li>
          <li>Object: Where we process your information based on our legitimate interests explained above, or in the public interest, you can object to this processing in certain circumstances. In such cases, we will cease processing your information unless we have compelling legitimate grounds to continue processing or where it is needed for legal reasons.</li>
          <li>Revoke consent: Where you have previously provided your consent, such as to permit us to process data about you, you have the right to withdraw your consent to the processing of your information at any time. For example, you can withdraw your consent by updating your settings. In certain cases, we may continue to process your information after you have withdrawn consent if we have a legal basis to do so or if your withdrawal of consent was limited to certain processing activities.</li>
          <li>Complain: Should you wish to raise a concern about our use of your information (and without prejudice to any other rights you may have), you have the right to do so with your local supervisory authority.</li>
        </ul>
        <p>Additionally, if you are a European resident, we note that we are processing your information in order to fulfil contracts we might have with you or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe.</p>
        <p>You can see more about these rights at:</p>
        <p><a href="https://ec.europa.eu/info/law/law-topic/data-protection/reform/rights-citizens_en">https://ec.europa.eu/info/law/law-topic/data-protection/reform/rights-citizens_en</a></p>

        <h3 className={classes.subTitle}>CALIFORNIA ONLINE PRIVACY PROTECTION ACT COMPLIANCE (CalOPPA)</h3>
        <p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law’s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared.</p>
        <p>Because we value your privacy, we have taken the necessary precautions to be in compliance with the California Online Privacy Protection Act (CalOPPA).</p>
        <p>According to the California Online Privacy act, you have the following rights:</p>
        <ul className={classes.mainList}>
          <li>Know what personal data is being collected.</li>
          <li>Know whether your personal data is sold or disclosed and to whom.</li>
          <li>Access to your personal data.</li>
          <li>Request to delete any personal information about you.</li>
          <li>Not be discriminated against for exercising their privacy rights.</li>
        </ul>

        <h3 className={classes.subTitle}>CHILDREN’S ONLINE PRIVACY PROTECTION</h3>
        <p>We are in compliance with the requirements of the California Online Privacy Protection Act (CalOPPA – U.S regulation) and the GDPR (General Data Protection Regulation - European regulation) regarding the protection of the personal data of minors. Our application and services are all directed to people who are at least 18 years old or older. We do not collect any information from anyone under 13 years of age. If you become aware that your child has provided us with personal information, please contact us. If we become aware that a child has provided us with personal information, we will take steps to delete that information, terminate that person's account, and restrict access to that person.</p>

        <h3 className={classes.subTitle}>EDITING AND DELETING INFORMATION</h3>
        <p>If you believe that any information, we have about you is incorrect or incomplete, please contact us through our contact information or contact page; we will promptly correct any information that is incorrect, inaccurate or imprecise. You may change, modify, rectify and delete your information at any time by sending us your request through our contact information or contact page.</p>
        <p>To unsubscribe from Kulan email, follow the instructions included in the email or send us your request through our contact information or contact page. Your request must be processed within 48 hours.</p>

        <h3 className={classes.subTitle}>SUPPLIERS AND OTHER THIRD PARTIES</h3>
        <p>Except as otherwise expressly included in this Privacy Policy, this document addresses only the use and disclosure of information Kulan collects from you. If you disclose your information to others, whether other users or suppliers on Kulan, different rules may apply to their use or disclosure of the information you disclose to them. Kulan does not control the privacy policies of third parties, and you are subject to the privacy policies of those third parties where applicable. Kulan is not responsible for the privacy or security practices of other websites on the Internet, even those linked to or from the Kulan site. Kulan encourages you to ask questions before you disclose your personal information to others.</p>

        <h3 className={classes.subTitle}>ENFORCEMENT</h3>
        <p>Kulan regularly reviews its compliance with this Policy. Please feel free to direct any questions or concerns regarding this Policy or Kulan treatment of personal information by contacting us.</p>
        <p>When we receive formal written complaints, it is Kulan policy to contact the complaining user regarding his or her concerns. We will cooperate with the appropriate regulatory authorities, including local data protection authorities, to resolve any complaints regarding the transfer of personal data that cannot be resolved between Kulan and an individual.</p>

        <h3 className={classes.subTitle}>CONTACT US</h3>
        <p>If you have questions or concerns about these Privacy Policy and the handling and security of your data on this website, please contact us through our contact form or contact at:</p>
        <p className={classes.normalBoldText}>Email: info@kulan.app</p>
      </div>
    </Grid>
  );
}

export default withRouter(PrivacyPolicy);
