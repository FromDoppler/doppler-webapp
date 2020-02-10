import signupBannerImagePath from '../img/signup-en.png';
import loginBannerImagePath from '../img/login-en.png';

// Basic constants
const year = new Date().getFullYear();
const urlDopplerLegacy = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlSite = `https://www.fromdoppler.com`;
const urlHelp = `https://help.fromdoppler.com/en`;
const patchForBlank = `rel="noopener noreferrer"`;
const urlShopify = process.env.REACT_APP_SHOPIFY_URL;

// Common URLs
const urlHelpAdvancedReports = `${urlHelp}/advanced-reports`;
const urlPrivacy = `${urlSite}/en/legal/privacy`;
const urlPrivacyFromSignup = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlPrivacyFromSignup_HTMLEncoded = `${urlPrivacy}?utm_source=app&amp;utm_medium=landing&amp;utm_campaign=signup`;
const urlPrivacyFromLogin = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=login`;
const urlPrivacyFromForgot = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=reset-password`;
const mailtoSupport = `mailto:support@fromdoppler.com`;
const urlControlPanel = `${urlDopplerLegacy}/ControlPanel`;
const urlBuyMonthly = `${urlControlPanel}/AccountPreferences/UpgradeAccount?Plan=monthly`;
const urlSiteTracking = `${urlControlPanel}/CampaignsPreferences/SiteTrackingSettings`;
const urlSiteFromSignup = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlSiteFromLogin = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=login`;
const urlSiteFromForgot = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=reset-password`;
const urlSiteContact = `${urlSite}/en/contact/`;
const urlControlPanelMain = `${urlControlPanel}/ControlPanel`;

export default {
  common: {
    advanced_preferences: `Integrations and Advanced Preferences`,
    back: `Back`,
    cancel: `Cancel`,
    connect: `Connect`,
    control_panel: `Control Panel`,
    control_panel_advanced_pref_url: `${urlControlPanelMain}?section=AdvancedPreferences`,
    control_panel_url: `${urlControlPanelMain}`,
    copyright_MD: `© ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacy}).`,
    empty_data: `Your domain has no data to show in this section yet.`,
    hide: `Hide`,
    message: `Message`,
    recaptcha_legal_HTML: `
    Site protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy?hl=en">Privacy Policy</a>
    and <a href="https://policies.google.com/terms?hl=en">Terms of Service</a>.
    `,
    send: `Send`,
    show: `Show`,
    synchronizing: `Synchronizing`,
    unexpected_error: `Ouch! An unexpected error occurred, please try again`,
  },
  default_banner_data: {
    background_url: 'https://cdn.fromdoppler.com/doppler-ui-library/v2.5.0/img/violet-yellow.png',
    description: 'Classics and pop-ups with Single or Double Opt-In subscription. You decide how you want them to look, what data to request and where to place them!',
    functionality: 'subscription forms',
    image_url: 'https://cdn.fromdoppler.com/doppler-ui-library/v2.5.0/img/login-en.png',
    title: 'Add new contacts to your Lists using custom Forms',
  },
  empty_notification_text: `You don't have pending notifications.`,
  feature_panel: {
    email_automation: `Email Automation`,
    email_automation_description: `Right person, right message, right time`,
    email_automation_remarks: `Send 100% personalized Emails according to the behavior and interests of your Subscribers. Save time and money!`,
    forms: `subscription forms`,
    forms_description: `Add new contacts to your Lists using custom Forms`,
    forms_remarks: `Classics and pop-ups with Single or Double Opt-In subscription. You decide how you want them to look, what data to request and where to place them!`,
  },
  footer: {
    iso: `ISO Quality Certification 9001:2008`,
  },
  forgot_password: {
    back_login: `Did you remember your Password? Go back to Log in.`,
    back_login_after_forgot: `Back to Log in`,
    blocked_account_MD: `Your account has been cancelled. To know more please [contact us](${urlSiteContact}).`,
    button_request: `Request`,
    confirmation_message_HTML: `
      <p>
        Check your inbox!
      </p>
      <p>
        You'll find an Email with steps to follow.
      </p>
      `,
    copyright_MD: `© ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacyFromForgot}).`,
    description: `Don't worry! It happens. Enter your Email and we'll be glad to help you.`,
    expired_link: `Link expired, please click on Forgot your Password? to request a new one.`,
    image_path: `${loginBannerImagePath}`,
    max_attempts_sec_question: `You didn't response correctly. Please, start again the process to reset your Doppler password.`,
    pass_reset_ok: `Your Password has been changed successfully!`,
    placeholder_email: `Psst! Is the same Email you used to create your account`,
    url_site: `${urlSiteFromForgot}`,
  },
  header: {
    help_url: `${urlHelp}`,
  },
  loading: `Loading...`,
  login: {
    button_login: `Log In`,
    copyright_MD: `© ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacyFromLogin}).`,
    enter_doppler: `Log In`,
    enter_doppler_sub: `Today is a good day to boost your business with Email, Automation & Data Marketing!`,
    error_payment_HTML: `Account blocked, please <a href="${mailtoSupport}">contact Support</a>.`,
    forgot_password: `Forgot your Password?`,
    head_description: `Attract, engage and convert clients using the Email Marketing Automation power. Try out Doppler!`,
    head_title: `Free Email Marketing Automation with no sending limits | Doppler`,
    image_path: `${loginBannerImagePath}`,
    label_user: `Username: `,
    placeholder_email: `Psst! It's your Email`,
    signup: `Sign up for free`,
    url_site: `${urlSiteFromLogin}`,
    you_want_create_account: `Don't have an account yet?`,
  },
  master_subscriber: {
    header_title: `Subscriber General Activity Report`,
    page_description: `Through this report you will be able to know the general activity of a specific subscriber`,
    page_title: `Doppler | Subscriber History`,
    search_form: {
      aria_label: `Filters form to search Subscriber History`,
      aria_search_field: `Enter an Email, First or Last Name to search for Subscriber History`,
      search_field_placeholder: `Search for a subscriber by Email, First or Last Name ...`,
      search_form_legend: `Advanced Subscriber History search`,
    },
    table_result: {
      aria_label_email: `Email`,
      aria_label_lastname: `Lastname`,
      aria_label_name: `Name`,
      aria_label_score: `Score`,
      aria_label_state: `State`,
      aria_label_table: `Subscriber history result`,
    },
  },
  master_subscriber_current_search: {
    grid_email: `Email`,
    grid_firstname: `Firstname`,
    grid_lastname: `Lastname`,
    grid_ranking: `Ranking`,
    grid_status: `Status`,
  },
  master_subscriber_sent_campaigns: {
    grid_campaign: `Campaign`,
    grid_clicks: `Unique Clicks`,
    grid_delivery: `Delivery Status`,
    grid_subject: `Subject`,
  },
  reports: {
    allow_enable_trial_HTML: `
      <p>
        Activate the trial period and access detailed Reports on the behavior of users inside your
        Website or E-commerce. Discover which are the most visited pages, how many visitors have an
        Email identified by Doppler and how many don't. Any doubts? Press
        <a target="_blank" href="${urlHelpAdvancedReports}" ${patchForBlank}>HELP</a>.
      </p>
      `,
    allow_enable_trial_button: `Start the trial`,
    allow_enable_trial_title: `Try On-Site Tracking Automation for a limited time`,
    datahub_not_domains_title: `Add your web domain and analyze the behavior of your users`,
    no_domains_HTML: `
      <p>
        Register the domain (s) you want to track and access to detailed Reports. Discover which are the
        most visited pages of your Website or E-commerce, how many visitors have been identified by
        Doppler and how many have not. Any doubts? Press
        <a target="_blank" href="${urlHelpAdvancedReports}" ${patchForBlank}>HELP</a>.
      </p>
      `,
    no_domains_button: `Add your domain`,
    no_domains_button_destination: `${urlSiteTracking}`,
    upgrade_account_free_HTML: `
      <p>
        Upgrade your account and access detailed Reports on the behavior of users on your Website or
        E-commerce. Discover which are the most visited pages, how many visitors have an Email that
        Doppler has identified and how many don't. Any doubts? Press
        <a target="_blank" href="${urlHelpAdvancedReports}" ${patchForBlank}>HELP</a>.
      </p>
      <p>
        By joining any Paid Plan you can enjoy FOR FREE this feature. Limited time only.
        <a href="${urlBuyMonthly}">UPGRADE NOW</a>.
      </p>
      `,
    upgrade_account_free_title: `Analyze your Subscriber's behaviour and improve your strategy`,
  },
  reports_box: {
    to: `to`,
    visits_description_with_email: `Total number of users who visited your Website and whose Email has been identified by Doppler. If a user entered several times, only one will be counted.`,
    visits_description_without_emails: `Total number of users who visited your Website and whose Email has not been identified by Doppler. If a user entered several times, only one will be counted.`,
    visits_with_email: `Users with Email`,
    visits_without_emails: `Users without Email`,
    without_included: `(not included)`,
  },
  reports_daily_visits: {
    title: `Unique Page views`,
    tooltip_page_views: `Pageviews: `,
    tooltip_with_email: `Users with Email: `,
    tooltip_without_email: `Users without Email: `,
  },
  reports_filters: {
    all_pages: `All pages`,
    description_HTML: `
      <p>
        Find out which are the most visited pages, how many of those visitors already have an Email
        identified by Doppler and how many don't. By tracking the user's journey you'll be able to
        detect vanishing points and opportunities for improvement! If you have any doubts, press
        <a target="_blank" href="${urlHelpAdvancedReports}" ${patchForBlank}>HELP</a>.
      </p>
      `,
    domain: `Domain`,
    domain_not_verified_MD: `Your domain is not verified. It is necessary to start obtaining data about your visits. [VERIFY DOMAIN](${urlSiteTracking}).`,
    pages: `Pages`,
    rank_time: `Time period`,
    title: `Track users behavior, analyze it and optimize your Marketing actions`,
    today: `Today`,
    verified_domain: `Last registered visit:`,
    week_with_plural: `{weeksCount, plural, =0 {no weeks} one {# week}other {# weeks} }`,
  },
  reports_hours_visits: {
    few_visits: '0 to {max}',
    lot_visits: `+{min}`,
    medium_visits: `{min} to {max}`,
    title: `Day of week and hours`,
    users: `Pages views:`,
    users_with_email: `Users with email:`,
    users_without_email: `Users without email:`,
  },
  reports_pageranking: {
    more_results: `Show more results`,
    top_pages: `Most visited pages`,
    total_visits: `Unique visitors`,
    visits_with_email: `Users with email`,
    visits_without_email: `Users without email`,
  },
  reports_title: `Doppler | Reports`,
  shopify: {
    admin_apps: `Shopify control panel`,
    admin_apps_url: `https://{shopName}/admin/apps`,
    connect_url: `${urlShopify}/install`,
    error_cannot_access_api: `Oops! We could not connect to Shopify API, please try again later.`,
    header_disconnected_warning: `By pressing "Connect" you will be redirected to Shopify, where you can carry out the necessary steps to integrate.`,
    header_store: `Account name:`,
    header_subtitle: `Automatically send all your E-commerce Contacts and their purchase data to a Doppler List. Also you can import your store products in Email Templates
    and create Abandoned Cart and Retargeting Product Automations. Any questions? Press <a target="_blank" href="${urlHelp}/how-to-integrate-doppler-with-shopify/" ${patchForBlank}>HELP</a>.`,
    header_synchronization_date: `Last synchronization date:`,
    header_title: `Connect Doppler with your Shopify store`,
    list_subtitle: `You can synchronize the data manually whenever you want.`,
    list_title: `Synchronized List`,
    no_list_available: `Waiting for List...`,
    table_list: `List Name`,
    table_shopify_customers_count: `Subscribers`,
    title: `Doppler | Shopify`,
  },
  signup: {
    activate_account_instructions: `* By clicking on the button from the Email, you will activate your account and you will be ready to enjoy all the benefits of Doppler.`,
    button_signup: `Sign up for free`,
    check_inbox: `Check your inbox. You have an Email!`,
    check_inbox_icon_description: `Check your inbox`,
    copyright_MD: `© ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacyFromSignup}).`,
    do_you_already_have_an_account: `Already have an account?`,
    email_not_received: `Haven't you received the Email?`,
    head_description: `Attract, engage and convert clients using the Email Marketing Automation power. Try out Doppler!`,
    head_title: `Free Email Marketing Automation with no sending limits | Doppler`,
    image_path: `${signupBannerImagePath}`,
    label_email: `Email: `,
    label_firstname: `Name: `,
    label_lastname: `Lastname: `,
    label_password: `Password: `,
    label_phone: `Phone: `,
    legal_HTML: `
      <p>
        Doppler informs you that the personal data you provide by completing this form will be
        treated by Doppler LLC as responsible for this web site.
      </p>
      <p>
        <strong>Purpose:</strong> Sign you up into our platform and provide the services that you require.
      </p>
      <p>
        <strong>Legitimation:</strong> Consent of the applicant.
      </p>
      <p>
        <strong>Recipients:</strong> Your data will be saved by Doppler, Zoho as CRM, Google as the
        provider of reCAPTCHA service, Digital Ocean, Cogeco Peer1 and Rackspace as hosting companies.
      </p>
      <p>
        <strong>Additional information:</strong> In Doppler's
        <a target="_blank" href="${urlPrivacyFromSignup_HTMLEncoded}" ${patchForBlank}>Privacy Policy</a>
        you'll find additional information about the data storage and use of your
        personal information, including information on access, conservation, rectification,
        deletion, security, cross-border data transfers and other issues.
      </p>
      `,
    log_in: `Log In`,
    no_more_resend_HTML: `You haven't received the Email yet? We have already forwarded it to you, if it doesn't arrive in the next few minutes, please <a href="${mailtoSupport}">contact Support</a>.`,
    placeholder_email: `Your Email will be your Username`,
    placeholder_password: `Enter your secret key`,
    placeholder_phone: `9 11 2345-6789`,
    privacy_policy_consent_HTML: `
      I accept Doppler's
      <a target="_blank" href="${urlPrivacyFromSignup_HTMLEncoded}" ${patchForBlank}>Privacy Policy</a>.
    `,
    promotions_consent: `Sign me up for promotions about Doppler and allies.`,
    resend_email: `Resent it`,
    sign_up: `Email, Automation & Data Marketing`,
    sign_up_sub: `Attract, Engage and Convert. Send unlimited Emails up to 500 Subscribers for free.`,
    thanks_for_registering: `Thank you for registering`,
    url_site: `${urlSiteFromSignup}`,
  },
  subscriber: {
    status: {
      active: 'Active',
      inactive: 'Active not Associated to List',
      pending: 'Pending',
      stand_by: 'On Hold waiting for Upgrade',
      unsubscribed_by_client: 'Removed by Client',
      unsubscribed_by_hard: 'Removed by Hard-Bounced',
      unsubscribed_by_never_open: 'Removed by Never-Opened',
      unsubscribed_by_soft: 'Removed by Soft-Bounced',
      unsubscribed_by_subscriber: 'Removed by Subscriber',
    },
  },
  subscriber_history: {
    alt_image: 'Campaign Preview',
    delivery_status: {
      hardBounced: 'Removed by Hard',
      notOpened: 'Not Opened',
      opened: 'Opened',
      softBounced: 'Removed by Soft',
    },
    empty_data: `So far there are no Campaigns sent`,
    table_result: {
      aria_label_table: `Campaign History result`,
    },
    unsubscribed_date: 'Unsubscribed Date:',
  },
  trafficSources: {
    direct: `Direct`,
    email: `Email`,
    organic: `Organic Search`,
    paid: `Paid Search`,
    referral: `Referral`,
    social: `Social`,
    title: `Traffic sources`,
    users_with_email: `Users with email`,
    users_without_email: `Users without email`,
  },
  upgradePlanForm: {
    message_placeholder: `Your message`,
    plan_select: `Select Plan`,
    title: `Request an update of your Plan`,
  },
  validation_messages: {
    error_account_is_blocked_invalid_pass_HTML: `
      For security reasons we've temporarily disabled your account.
      <a href="${mailtoSupport}">Contact us</a>.
      `,
    error_account_is_canceled_HTML: `
      Your account has been cancelled. To know more please
      <a href="${mailtoSupport}">contact us</a>.
      `,
    error_checkbox_policy: `Ouch! You haven't accepted the Doppler's Privacy Policy.`,
    error_email_already_exists: `Ouch! You already have a Doppler account.`,
    error_invalid_captcha: `Ouch! We couldn't validate you are a human, please reload the page and try again.`,
    error_invalid_domain_to_register_account: `Ouch! Invalid Email to create an account.`,
    error_invalid_email_address: `Ouch! Enter a valid Email.`,
    error_invalid_login: `Ouch! There is an error in your Username or Password. Please, try again.`,
    error_invalid_name: `Ouch! Write only letters, not numbers.`,
    error_min_length: `Ouch! Enter a minimum characters count.`,
    error_min_length_2: `Ouch! Write at least two characters.`,
    error_password_character_length: `8 characters minimum`,
    error_password_digit: `One number`,
    error_password_letter: `One letter`,
    error_password_safe: `Your Password is secure!`,
    error_phone_invalid: `Ouch! Enter a valid phone number.`,
    error_phone_invalid_country: `Ouch! The country code is not valid.`,
    error_phone_too_long: `Ouch! The phone number is too long.`,
    error_phone_too_short: `Ouch! The phone number is too short.`,
    error_register_denied: `Hold on! You've reached the maximum accounts allowed.`,
    error_required_field: `Ouch! The field is empty.`,
    error_unexpected_HTML: `
      Unexpected error. Please try again* or
      <a href="${mailtoSupport}">contact Support</a>.
      <br/><br/>
      <i>*If you have ad blockers installed,
      please disable them on retry.</i>
      `,
  },
};
