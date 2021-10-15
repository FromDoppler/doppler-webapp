function importAllImages(r) {
  let images = {};
  r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAllImages(require.context('./images', false, /\.(png|jpe?g|svg)$/));

export const controlPanelSections = [
  {
    title: 'control_panel.account_preferences.title',
    items: [
      {
        linkUrl: 'control_panel.account_preferences.account_information_link',
        imgSrc: images['account_information_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.account_information_title',
        iconName: 'control_panel.account_preferences.account_information_title',
      },
      {
        linkUrl: 'control_panel.account_preferences.account_movements_link',
        imgSrc: images['account_movements_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.account_movements_title',
        iconName: 'control_panel.account_preferences.account_movements_title',
      },
      {
        linkUrl: 'control_panel.account_preferences.contact_information_link',
        imgSrc: images['contact_information_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.contact_information_title',
        iconName: 'control_panel.account_preferences.contact_information_title',
      },
      {
        linkUrl: 'control_panel.account_preferences.billing_information_link',
        imgSrc: images['billing_information_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.billing_information_title',
        iconName: 'control_panel.account_preferences.billing_information_title',
      },
      {
        linkUrl: 'control_panel.account_preferences.sms_settings_link',
        imgSrc: images['sms_settings_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.sms_settings_title',
        iconName: 'control_panel.account_preferences.sms_settings_title',
      },
      {
        linkUrl: 'control_panel.account_preferences.plans_and_specs_link',
        imgSrc: images['plans_and_specs_icon.png'].default,
        imgAlt: 'control_panel.account_preferences.plans_and_specs_title',
        iconName: 'control_panel.account_preferences.plans_and_specs_title',
      },
    ],
  },
  {
    title: 'control_panel.campaign_preferences.title',
    items: [
      {
        linkUrl: 'control_panel.campaign_preferences.footer_and_header_preferences_link',
        imgSrc: images['footer_and_header_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.footer_and_header_preferences_title',
        iconName: 'control_panel.campaign_preferences.footer_and_header_preferences_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.unsubscription_link_link',
        imgSrc: images['unsubscription_link_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.unsubscription_link_title',
        iconName: 'control_panel.campaign_preferences.unsubscription_link_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.unopened_mails_config_link',
        imgSrc: images['unopened_mails_config_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.unopened_mails_config_title',
        iconName: 'control_panel.campaign_preferences.unopened_mails_config_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.subscribers_scoring_link',
        imgSrc: images['subscribers_scoring_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.subscribers_scoring_title',
        iconName: 'control_panel.campaign_preferences.subscribers_scoring_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.bounce_handling_link',
        imgSrc: images['bounce_handling_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.bounce_handling_title',
        iconName: 'control_panel.campaign_preferences.bounce_handling_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.contact_policy_link',
        imgSrc: images['contact_policy_icon.svg'].default,
        imgAlt: 'control_panel.campaign_preferences.contact_policy_title',
        iconName: 'control_panel.campaign_preferences.contact_policy_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.email_parameter_link',
        imgSrc: images['email_parameter_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.email_parameter_title',
        iconName: 'control_panel.campaign_preferences.email_parameter_title',
      },
      {
        linkUrl: 'control_panel.campaign_preferences.site_tracking_link',
        imgSrc: images['site_tracking_icon.png'].default,
        imgAlt: 'control_panel.campaign_preferences.site_tracking_title',
        iconName: 'control_panel.campaign_preferences.site_tracking_title',
      },
    ],
  },
  {
    title: 'control_panel.social_preferences.title',
    items: [
      {
        linkUrl: 'control_panel.social_preferences.social_network_link',
        imgSrc: images['social_network_icon.png'].default,
        imgAlt: 'control_panel.social_preferences.social_network_title',
        iconName: 'control_panel.social_preferences.social_network_title',
      },
      {
        linkUrl: 'control_panel.social_preferences.rss_preferences_link',
        imgSrc: images['rss_preferences_icon.png'].default,
        imgAlt: 'control_panel.social_preferences.rss_preferences_title',
        iconName: 'control_panel.social_preferences.rss_preferences_title',
      },
      {
        linkUrl: 'control_panel.social_preferences.viralization_link',
        imgSrc: images['viralization_icon.png'].default,
        imgAlt: 'control_panel.social_preferences.viralization_title',
        iconName: 'control_panel.social_preferences.viralization_title',
      },
      {
        linkUrl: 'control_panel.social_preferences.auto_publish_link',
        imgSrc: images['auto_publish_icon.png'].default,
        imgAlt: 'control_panel.social_preferences.auto_publish_title',
        iconName: 'control_panel.social_preferences.auto_publish_title',
      },
    ],
  },
];
