export const shouldHideCreateCampaignButton = (session) =>
  session?.status === 'authenticated' &&
  session.userData?.user?.hasClientManager &&
  !session.userData?.nav?.some((item) => item.idHTML === 'campaignMenu');
