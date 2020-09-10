import signupBannerImagePath from '../img/signup-en.png';
import loginBannerImagePath from '../img/login-en.png';

// Basic constants
const year = new Date().getFullYear();
const urlDopplerLegacy = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlSite = `https://www.fromdoppler.com`;
const urlHelp = `https://help.fromdoppler.com/en`;
const urlShopify = process.env.REACT_APP_SHOPIFY_URL;
const dopplerUiLibraryVersion = process.env.REACT_APP_DOPPLER_UI_LIBRARY_VERSION;

// Common URLs
const urlHelpAdvancedReports = `${urlHelp}/advanced-reports`;
const urlPrivacy = `${urlSite}/en/legal/privacy`;
const urlPrivacyFromSignup = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlPrivacyFromSignup_HTMLEncoded = `${urlPrivacy}?utm_source=app&amp;utm_medium=landing&amp;utm_campaign=signup`;
const urlPrivacyFromLogin = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=login`;
const urlPrivacyFromForgot = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=reset-password`;
const mailtoSupport = `mailto:support@fromdoppler.com`;
const mailtoAdmin = `mailto:administracion@fromdoppler.com`;
const subjectBlockedAccountNoPay = `?subject=Cuenta%20suspendida%20por%20falta%20de%20pago%20-%20Login`;
const subjectCanceledAccountNoPay = `?subject=Cuenta%20cancelada%20por%20falta%20de%20pago%20-%20Login`;
const subjectCanceledAccountOtherReason = `?subject=Cuenta%20cancelada%20-%20Login`;
const subjectBlockedAccountInvalidPassword = `?subject=Cuenta%20bloqueada%20por%20intentos%20fallidos%20-%20Login`;
const urlControlPanel = `${urlDopplerLegacy}/ControlPanel`;
const urlBuyMonthly = `${urlControlPanel}/AccountPreferences/UpgradeAccount?Plan=monthly`;
const urlSiteTracking = `${urlControlPanel}/CampaignsPreferences/SiteTrackingSettings`;
const urlSiteFromSignup = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlSiteFromLogin = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=login`;
const urlSiteFromForgot = `${urlSite}/en/?utm_source=app&utm_medium=landing&utm_campaign=reset-password`;
const urlSiteContact = `${urlSite}/en/contact/`;
const urlControlPanelMain = `${urlControlPanel}/ControlPanel`;
const urlMasterSubscriber = `${urlDopplerLegacy}/Lists/MasterSubscriber/`;

export default {
  change_plan: {
    agencies_icon: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/icono-agencias.svg`,
    all_of_plan: `Everything from {plan} Plus:`,
    ask_demo: 'Ask for a demo',
    big_data_tooltip: 'Big Data feature',
    calculate_price: 'Calculate Price',
    cancel_campaign: 'Cancel Campaign',
    compare_features: 'Compare Features',
    current_plan: 'Current Plan',
    description: 'Do you send periodically or one newsletter per month?',
    description_agencies: 'Manage all your clients all in one spot.',
    description_free: 'Try a FREE Doppler account with no contracts or credit cards. Until 500 Contacts.',
    description_plus: 'Advanced features for professionals with custom needs.',
    description_standard: 'Try our plans that best fit to your needs, monthly or prepaids.',
    email_parameter: 'Email parameter',
    features_HTML_agencies: `
    <option>Manage several accounts</option>
    <option>Manage access to different accounts</option>
    <option>Manage roles</option>`,
    features_HTML_free: `
    <option>Customer Support</option>
    <option>Regular Campaigns</option>
    <option>Basic Automation Campaigns</option>`,
    features_HTML_plus: `
    <star>VIP Customer Support</star>
    <newOption>Stop Campaigns</newOption>
    <option>Custom domains for your Landing Pages</option>
    <newBigData>Subject suggestion</newBigData>`,
    features_HTML_standard: `
    <option>Doppler API access</option>
    <option>Site Behaviour Automation Campaigns</option>
    <option>Custom signature Campaigns</option>`,
    features_title_plus: 'All in standard and:',
    features_title_standard: 'All in free and:',
    increase_action_monthly_deliveries: 'Increase Deliveries',
    increase_action_prepaid: 'Buy Credits',
    increase_action_subscribers: 'Increase Contacts',
    new_label: 'New',
    per_month: 'per month',
    recommended: 'Recommended',
    selected_type: 'Plans selected by: ',
    shipping_limit: 'Shipping Limit',
    since: 'Since',
    site_tracking: 'On-Site Tracking',
    smart_campaigns: 'Smart Send Out',
    title: 'Plans sized up for your business',
    until_x_subscribers: `Until {subscribers} Contacts.`,
  },
  common: {
    advanced_preferences: `Integrations and Advanced Preferences`,
    back: `Back`,
    cancel: `Cancel`,
    connect: `Connect`,
    control_panel: `Control Panel`,
    control_panel_advanced_pref_url: `${urlControlPanelMain}?section=AdvancedPreferences`,
    control_panel_section_url: `${urlControlPanel}`,
    control_panel_url: `${urlControlPanelMain}`,
    copyright_MD: `© ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacy}).`,
    empty_data: `Your domain has no data to show in this section yet.`,
    feature_no_available: `The feature is not available yet`,
    hide: `Hide`,
    message: `Message`,
    recaptcha_legal_MD: `
Site protected by reCAPTCHA and the Google [Privacy Policy](https://policies.google.com/privacy?hl=en) and [Terms of Service](https://policies.google.com/terms?hl=en).`,
    send: `Send`,
    show: `Show`,
    synchronizing: `Synchronizing`,
    ui_library_image: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/{imageUrl}`,
    unexpected_error: `Ouch! An unexpected error occurred, please try again`,
  },
  default_banner_data: {
    background_url: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/violet-yellow.png`,
    description: 'Classics and pop-ups with Single or Double Opt-In subscription. You decide how you want them to look, what data to request and where to place them!',
    functionality: 'subscription forms',
    image_url: `https://cdn.fromdoppler.com/doppler-ui-library/${dopplerUiLibraryVersion}/img/login-en.png`,
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
    confirmation_message_MD: `
Check your inbox!

You'll find an Email with steps to follow.`,
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
    allow_enable_trial_MD: `Activate the trial period and access detailed Reports on the behavior of users inside your
    Website or E-commerce. Discover which are the most visited pages,
    how many visitors have an Email identified by Doppler and how many don't. Any doubts? Press [HELP](${urlHelpAdvancedReports})`,
    allow_enable_trial_button: `Start the trial`,
    allow_enable_trial_title: `Try On-Site Tracking Automation for a limited time`,
    datahub_not_domains_title: `Add your web domain and analyze the behavior of your users`,
    no_domains_MD: `
Register the domain (s) you want to track and access to detailed Reports. Discover which are the
most visited pages of your Website or E-commerce, how many visitors have been identified by
Doppler and how many have not. Any doubts? Press [HELP](${urlHelpAdvancedReports}).`,
    no_domains_button: `Add your domain`,
    no_domains_button_destination: `${urlSiteTracking}`,
    upgrade_account_free_MD: `
Upgrade your account and access detailed Reports on the behavior
of users on your Website or E-commerce. Discover which are the most visited pages,
how many visitors have an Email that Doppler has identified and how many don't.
Any doubts? Press [HELP](${urlHelpAdvancedReports}).

By joining any Paid Plan you can enjoy FOR FREE this feature. Limited time only. [UPGRADE NOW](${urlBuyMonthly}).`,
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
    description_MD: `
Find out which are the most visited pages, how many of those visitors already have an Email identified
by Doppler and how many don't. By tracking the user's journey you'll be able to detect vanishing points and opportunities for improvement! If you have any doubts, press [HELP](${urlHelpAdvancedReports}).
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
    total_visits: `Visits`,
    visits_with_email: `User visits with Email`,
    visits_without_email: `User visits without Email`,
  },
  reports_partials_campaigns: {
    campaign_name: `Campaign name: `,
    campaign_state: `Campaign status`,
    campaign_subject: `Subject: `,
    campaign_summary: `Campaign Summary`,
    delivery_rate: `Delivery Rate`,
    emails_delivered: `Emails Delivered:`,
    hard_and_soft: `Hard and Soft bounces`,
    header_description_shipped: `Your Campaign has been sent. These are the final results.`,
    header_description_shipping: `Your Campaign is being sent. These are the partial results so far.`,
    header_title_shipped: `Campaign Report`,
    header_title_shipping: `Progress Report`,
    last_click_date: `Last Click Date:`,
    last_open_date: `Last Open Date:`,
    not_open: `Not Open`,
    opened: `Opened`,
    page_description: `Partial Campaign Reports`,
    page_title: `Doppler | Partial Campaign Reports`,
    shipped: `Sent`,
    shipping: `Sending`,
    total_clicks: `Total Clicks:`,
    total_forwarded: `Total Forwarded:`,
    total_openings: `Total Openings:`,
    total_recipients: `Total recipients`,
    total_sent_so_far: `Emails sent so far`,
    total_subscribers: `Total Subscribers:`,
    total_unsubscribers: `Total Unsubscribers:`,
    unique_clicks: `Unique Clicks:`,
    unique_opens: `Unique Opens:`,
  },
  reports_title: `Doppler | Reports`,
  shopify: {
    admin_apps: `Shopify control panel`,
    admin_apps_url: `https://{shopName}/admin/apps`,
    connect_url: `${urlShopify}/install`,
    error_cannot_access_api: `Oops! We could not connect to Shopify API, please try again later.`,
    header_disconnected_warning: `By pressing "Connect" you will be redirected to Shopify, where you can carry out the necessary steps to integrate.`,
    header_store: `Account name:`,
    header_subtitle_MD: `
Automatically send all your E-commerce Contacts and their purchase data to a Doppler List. Also you can import your store products in Email Templates
and create Abandoned Cart and Retargeting Product Automations. Any questions? Press [HELP](${urlHelp}/how-to-integrate-doppler-with-shopify/).`,
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
    legal_MD: `
Doppler informs you that the personal data you provide by completing this form will be treated by Doppler LLC as responsible for this web site.

**Purpose:** Sign you up into our platform and provide the services that you require.

**Legitimation:** Consent of the applicant.

**Recipients:** Your data will be saved by Doppler, Zoho as CRM, Google as the provider of reCAPTCHA service, Digital Ocean, Cogeco Peer1 and Rackspace as hosting companies.

**Additional information:** In Doppler's [Privacy Policy](${urlPrivacyFromSignup_HTMLEncoded})
you'll find additional information about the data storage and use of your
personal information, including information on access, conservation, rectification,
deletion, security, cross-border data transfers and other issues.
  `,
    log_in: `Log In`,
    no_more_resend_MD: `You haven't received the Email yet? We have already forwarded it to you, if it doesn't arrive in the next few minutes, please [contact Support](${mailtoSupport}).`,
    placeholder_email: `Your Email will be your Username`,
    placeholder_password: `Enter your secret key`,
    placeholder_phone: `9 11 2345-6789`,
    privacy_policy_consent_MD: `I accept Doppler's [Privacy Policy](${urlPrivacyFromSignup_HTMLEncoded}).`,
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
      standBy: 'On Hold waiting for Upgrade',
      unsubscribed_by_client: 'Removed by Client',
      unsubscribed_by_hard: 'Removed by Hard-Bounced',
      unsubscribed_by_never_open: 'Removed by Never-Opened',
      unsubscribed_by_soft: 'Removed by Soft-Bounced',
      unsubscribed_by_subscriber: 'Removed by Subscriber',
    },
  },
  subscriber_gdpr: {
    description: 'Here you can find all permissions given by your Subscriber.',
    empty_data: 'This Subscriber has not given or denied any permission.',
    empty_html_text: 'With no legal text defined',
    permission_description: 'Custom text',
    permission_name: 'Field Name',
    permission_value: 'Value',
    title: 'Subscriber GDPR state',
    value_false: 'Rejected',
    value_none: 'No response',
    value_true: 'Accepted',
  },
  subscriber_history: {
    alt_image: 'Campaign Preview',
    delivery_status: {
      hardBounced: 'Removed by Hard',
      notOpened: 'Not Opened',
      opened: 'Opened',
      softBounced: 'Removed by Soft',
    },
    description: 'Here you will be able to know the Campaign behavior history of your Subscribers.',
    empty_data: `So far there are no Campaigns sent`,
    subscriber_breadcrumb: 'Subscribers',
    subscriber_breadcrumb_url: `${urlMasterSubscriber}`,
    table_result: {
      aria_label_table: `Campaign History result`,
    },
    title: 'Subscriber historical behavior',
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
    error_account_contact_zoho_chat: `<button>Chat with the Customer Support team</button> for help.`,
    error_account_is_blocked_invalid_password: `Ouch! This account has been blocked due to failed access attempts.`,
    error_account_is_blocked_invalid_password_contact_support_MD: `Please [contact the Customer Support team](${mailtoAdmin + subjectBlockedAccountInvalidPassword}) for help.`,
    error_account_is_blocked_invalid_password_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta bloqueada por intentos fallidos?`,
    error_account_is_blocked_not_pay: `Ouch! This account has been suspended due to non-payment.`,
    error_account_is_blocked_not_pay_contact_support_MD: `Please [contact the Customer Support team](${mailtoAdmin + subjectBlockedAccountNoPay}) for help.`,
    error_account_is_blocked_not_pay_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta suspendida por falta de pago?`,
    error_account_is_canceled_not_pay: `Ouch! This account has been canceled due to non-payment.`,
    error_account_is_canceled_not_pay_contact_support_MD: `Please [contact the Customer Support team](${mailtoAdmin + subjectCanceledAccountNoPay}) for help.`,
    error_account_is_canceled_not_pay_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta cancelada por falta de pago?`,
    error_account_is_canceled_other_reason: `Ouch! This account has been canceled.`,
    error_account_is_canceled_other_reason_contact_support_MD: `Please [contact the Customer Support team](${mailtoAdmin + subjectCanceledAccountOtherReason}) for help.`,
    error_account_is_canceled_other_reason_zoho_chat_msg: `¡Hola! ¿Me ayudas con mi cuenta cancelada?`,
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
    error_unexpected_MD: `
Ouch! Something went wrong. Please try again later or [contact Support](${mailtoSupport}).

**If you have ad blockers installed, we recommend that you disable them when you try again.*`,
  },
};
