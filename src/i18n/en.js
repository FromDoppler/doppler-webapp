// Basic constants
const year = new Date().getFullYear();
const urlDopplerLegacy = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlSite = `https://www.fromdoppler.com`;
const urlHelp = `https://help.fromdoppler.com/en/`;

// Common URLs
const urlPrivacy = `${urlSite}/en/legal/privacy`;
const urlPrivacyWithQueryString = `${urlPrivacy}?utm_source=app&utm_medium=landing&utm_campaign=signup`;
const urlContact = `${urlSite}/en/contact`;
const urlControlPanel = `${urlDopplerLegacy}/ControlPanel`;
const urlBuyMonthly = `${urlControlPanel}/AccountPreferences/UpgradeAccount?Plan=monthly`;
const urlSiteTracking = `${urlControlPanel}/CampaignsPreferences/SiteTrackingSettings`;

export default {
  common: {
    cancel: `Cancel`,
    copyright_MD: `
© ${year} Doppler LLC. All rights reserved. [Privacy and Legal Policy](${urlPrivacy}).
`,
    help: `Help`,
    hide: `Hide`,
    message: `Message`,
    recaptcha_legal_HTML: `
      Site protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy?hl=en">Privacy Policy</a>
      and <a href="https://policies.google.com/terms?hl=en">Terms of Service</a>.
      `,
    send: `Send`,
    show: `Show`,
  },
  feature_panel: {
    email_automation: `Email Automation`,
    email_automation_description: `Right person, right message, right time`,
    email_automation_remarks: `Send 100% personalized Emails according to the behavior and interests of your Subscribers. Save time and money!`,
    email_editor: `Emails Editor`,
    email_editor_description: `Crea Emails en minutos y accede a nuestra Galería de Plantillas`,
    email_editor_remarks: `Nuestras Plantillas para Email son totalmente Responsive y fácilmente editables desde nuestro Editor HTML.`,
    forms: `subscription forms`,
    forms_description: `Add new contacts to your Lists using custom Forms`,
    forms_remarks: `Classics and pop-ups with Single or Double Opt-In subscription. You decide how you want them to look, what data to request and where to place them!`,
  },
  footer: {
    iso: `ISO Quality Certification 9001:2008`,
  },
  forgot_password: {
    back_login: `Did you remember your password and want to return?`,
    back_login_after_forgot: `Return to login`,
    confirmation_message_HTML: `
      <p>
        Check your inbox!
      </p>
      <p>
        You'll find an Email with steps to follow.
      </p>
      `,
    description: `Do not worry! It happens to everyone.`,
    description2: `Enter your Email and we will help you`,
  },
  header: {
    help_url: `${urlHelp}`,
  },
  loading: `Loading...`,
  login: {
    button_login: `Enter`,
    enter_doppler: `Enter Doppler`,
    enter_doppler_sub: `Enjoy the benefits of Email Marketing.`,
    error_payment: `Account blocked, please contact Support.`,
    forgot_password: `Do not you remember your password?`,
    head_description: `Attract, engage and convert clients using the Email Marketing Automation power. Try out Doppler!`,
    head_title: `Free Email Marketing Automation with no sending limits | Doppler`,
    label_user: `Username: `,
    signup: `Sign up free`,
    you_want_create_account: `Do not you have an account yet?`,
  },
  reports: {
    allow_enable_trial_HTML: `
      <p>
        Activate the trial period and access detailed Reports on the behavior of users inside your
        Website or E-commerce. Discover which are the most visited pages, how many visitors have an
        Email identified by Doppler and how many don't. Any doubts? Press
        <a target="_blank" href="${urlHelp}/advanced-reports">HELP</a>.
      </p>
      `,
    allow_enable_trial_button: `Start the trial`,
    allow_enable_trial_title: `Try On-Site Tracking Automation for a limited time`,
    datahub_not_active_HTML: `
      <p>
        How do users behave on your Website or E-commerce? Track their behavior for a period of time and
        find out which are the most visited pages, how many of those visits have an Email identified by
        Doppler and how many don't. By tracking the user's journey you'll be able to detect vanishing
        points and opportunities for improvement!
      </p>
      <p>
        You haven't enabled On-Site Tracking yet. You can trigger it from the
        <a href="${urlSiteTracking}">On-Site Tracking</a> option in the Control Panel.
      </p>
      `,
    datahub_not_active_title: `Track user behavior and optimize your Marketing actions`,
    datahub_not_domains_title: `Add your web domain and analyze the behavior of your users`,
    no_domains_HTML: `
      <p>
        Register the domain (s) you want to track and access to detailed Reports. Discover which are the
        most visited pages of your Website or E-commerce, how many visitors have been identified by
        Doppler and how many have not. Any doubts? Press
        <a target="_blank" href="${urlHelp}/advanced-reports">HELP</a>.
      </p>
      <p>
        <a href="${urlSiteTracking}">Add your domain</a>.
      </p>
      `,
    upgrade_account_free_HTML: `
      <p>
        Upgrade your account and access detailed Reports on the behavior of users on your Website or
        E-commerce. Discover which are the most visited pages, how many visitors have an Email that
        Doppler has identified and how many don't. Any doubts? Press
        <a target="_blank" href="${urlHelp}/en/advanced-reports">HELP</a>.
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
  },
  reports_filters: {
    all_pages: `All pages`,
    description_HTML: `
      <p>
        Find out which are the most visited pages, how many of those visitors already have an Email
        identified by Doppler and how many don't. By tracking the user's journey you'll be able to
        detect vanishing points and opportunities for improvement! If you have any doubts, press
        <a target="_blank" href="${urlHelp}/advanced-reports">HELP</a>.
      </p>
      `,
    domain: `Domain`,
    domain_not_verified: `Not verified domain`,
    pages: `Pages`,
    rank_time: `Time period`,
    title: `Track users behavior, analyze it and optimize your Marketing actions`,
    verified_domain: `Verified domain`,
    week_with_plural: `{weeksCount, plural, =0 {no weeks} one {# week}other {# weeks} }`,
  },
  reports_pageranking: {
    top_pages: `Most visited pages`,
    top_pages_sub_head: `Sessions are the total number of registered visits during the period. If a user entered several times, all of them will be counted.`,
    total_visits: `Sessions`,
  },
  reports_title: `Doppler | Reports`,
  signup: {
    activate_account_instructions: `* By clicking on the button from the Email, you will activate your account and you will be ready to enjoy all the benefits of Doppler.`,
    button_signup: `Sign up for free`,
    check_inbox: `Check your inbox. You have an Email!`,
    check_inbox_icon_description: `Check your inbox`,
    do_you_already_have_an_account: `Already have an account?`,
    email_not_received: `Haven't you received the Email?`,
    head_description: `Attract, engage and convert clients using the Email Marketing Automation power. Try out Doppler!`,
    head_title: `Free Email Marketing Automation with no sending limits | Doppler`,
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
        <a target="_blank" href="${urlPrivacyWithQueryString}">Privacy Policy</a>
        you'll find additional information about the data storage and use of your
        personal information, including information on access, conservation, rectification,
        deletion, security, cross-border data transfers and other issues.
      </p>
      `,
    log_in: `Log In`,
    no_more_resend: `You haven't received the Email yet? We have already forwarded it to you, if it doesn't arrive in the next few minutes, please contact Support`,
    placeholder_email: `Your Email will be your Username`,
    placeholder_password: `Enter your secret key`,
    placeholder_phone: `9 11 2345-6789`,
    privacy_policy_consent_HTML: `
      I accept Doppler's
      <a target="_blank" href="${urlPrivacyWithQueryString}">Privacy Policy</a>.
      `,
    promotions_consent: `Sign me up for promotions about Doppler and allies.`,
    resend_email: `Resent it`,
    sign_up: `Email, Automation & Data Marketing`,
    sign_up_sub: `Attrack, Engage and Convert. Send unlimited Emails up to 500 Subscribers for free.`,
    thanks_for_registering: `Thank you for registering`,
  },
  upgradePlanForm: {
    message_placeholder: `Your message`,
    plan_select: `Select Plan`,
    title: `Request an update of your Plan`,
  },
  validation_messages: {
    error_account_is_blocked_invalid_pass_HTML: `
      For security reasons we've temporarily disabled your account.
      <a href="${urlContact}" target="_blank">Contact us</a>.
      `,
    error_account_is_canceled_HTML: `
      Your account has been cancelled. To know more please
      <a target="_blank" href="${urlContact}">contact us</a>.
      `,
    error_checkbox_policy: `Ouch! You haven't accepted the Doppler's Privacy Policy.`,
    error_email_already_exists: `Ouch! You already have a Doppler account.`,
    error_invalid_domain_to_register_account: `Ouch! Invalid Email to create an account.`,
    error_invalid_email_address: `Ouch! Enter a valid Email.`,
    error_invalid_login: `Ouch! There is an error in your Username or Password. Please, try again.`,
    error_password_character_length: `8 characters minimum`,
    error_password_digit: `One number`,
    error_password_letter: `One letter`,
    error_password_safe: `Your password is secure!`,
    error_phone_invalid: `Ouch! Enter a valid phone number.`,
    error_phone_invalid_country: `Ouch! The country code is not valid.`,
    error_phone_too_long: `Ouch! The phone number is too long.`,
    error_phone_too_short: `Ouch! The phone number is too short.`,
    error_required_field: `Ouch! The field is empty.`,
    error_unexpected: `Unexpected error. Please try again or contact Support.`,
  },
};
