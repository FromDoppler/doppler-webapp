import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { AddOnType } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';

const CARDS_PER_PAGE = 3;

const getCheapestPrice = (plans, priceField) => {
  const prices = plans
    ?.map((plan) => Number(plan?.[priceField]))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (!prices?.length) {
    return null;
  }

  return Math.min(...prices);
};

const getAddOnPlansPrice = async (dopplerAccountPlansApiClient, addOnType) => {
  const response = await dopplerAccountPlansApiClient.getAddOnPlans(addOnType);

  if (!response.success) {
    throw new Error(response.error || response.value || 'Unexpected Add-on plans error');
  }

  return getCheapestPrice(response.value, 'fee');
};

const getLandingPacksPrice = async (dopplerAccountPlansApiClient) => {
  const response = await dopplerAccountPlansApiClient.getLandingPacks();

  if (!response.success) {
    throw new Error(response.error || response.value || 'Unexpected Landing Packs error');
  }

  return getCheapestPrice(response.value, 'price');
};

const getAddonConfigs = ({ canShowEcoIA, canShowPushNotification }) => [
  ...(canShowEcoIA
    ? [
        {
          id: 'eco-ai',
          icon: 'dpicon icon-sparkle-ia',
          titleKey: 'my_plan.addons.eco_ai.title',
          descriptionKey: 'my_plan.addons.eco_ai.description',
          priceLabelKey: <FormattedMessage id={`my_plan.addons.eco_ai.access_by_legend`} />,
          periodKey: 'my_plan.addons.eco_ai.month_legend',
          isNewFeature: true,
          isBeta: true,
          getPrice: (dopplerAccountPlansApiClient) =>
            getAddOnPlansPrice(dopplerAccountPlansApiClient, AddOnType.EcoAI),
        },
      ]
    : []),
  {
    id: 'conversations',
    icon: 'dpicon iconapp-chatting',
    titleKey: 'my_plan.addons.conversations.title',
    descriptionKey: 'my_plan.addons.conversations.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.conversations.plans_from_legend`} />,
    periodKey: 'my_plan.addons.conversations.month_legend',
    getPrice: (dopplerAccountPlansApiClient) =>
      getAddOnPlansPrice(dopplerAccountPlansApiClient, AddOnType.Conversations),
  },
  ...(canShowPushNotification
    ? [
        {
          id: 'push-notification',
          icon: 'dpicon iconapp-bell1',
          titleKey: 'my_plan.addons.push_notification.title',
          descriptionKey: 'my_plan.addons.push_notification.description',
          priceLabelKey: (
            <FormattedMessage id={`my_plan.addons.push_notification.plans_from_legend`} />
          ),
          periodKey: 'my_plan.addons.push_notification.month_legend',
          getPrice: (dopplerAccountPlansApiClient) =>
            getAddOnPlansPrice(dopplerAccountPlansApiClient, AddOnType.PushNotifications),
        },
      ]
    : []),
  {
    id: 'onsite',
    icon: 'dpicon iconapp-online-clothing',
    titleKey: 'my_plan.addons.onsite.title',
    descriptionKey: 'my_plan.addons.onsite.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.onsite.plans_from_legend`} />,
    periodKey: 'my_plan.addons.onsite.month_legend',
    getPrice: (dopplerAccountPlansApiClient) =>
      getAddOnPlansPrice(dopplerAccountPlansApiClient, AddOnType.OnSite),
  },
  {
    id: 'sms',
    icon: 'dpicon iconapp-checklist',
    titleKey: 'my_plan.addons.sms.title',
    descriptionKey: 'my_plan.addons.sms.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.sms.load_from_legend`} />,
    periodKey: 'my_plan.addons.sms.minimum_load_legend',
    getPrice: () => {
      return 50; /* As SMS add-on has a fixed price, we return it directly without making an API call */
    },
  },
  {
    id: 'transactional-emails',
    icon: 'dpicon iconapp-send-mail',
    titleKey: 'my_plan.addons.transactional_emails.title',
    descriptionKey: 'my_plan.addons.transactional_emails.description',
    priceLabelKey: (
      <FormattedMessage
        id={`my_plan.addons.transactional_emails.email_plan_legend`}
        values={{
          emails: 50000,
        }}
      />
    ),
    periodKey: 'my_plan.addons.transactional_emails.month_legend',
    getPrice: () => {
      return 26.5; /* As transactional emails add-on has a fixed price, we return it directly without making an API call */
    },
  },
  {
    id: 'landing-pages',
    icon: 'dpicon iconapp-landing-page',
    titleKey: 'my_plan.addons.landing_pages.title',
    descriptionKey: 'my_plan.addons.landing_pages.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.landing_pages.packs_from_legend`} />,
    periodKey: 'my_plan.addons.landing_pages.month_legend',
    getPrice: getLandingPacksPrice,
  },
  {
    id: 'collaborators',
    icon: 'dpicon iconapp-add-friend',
    titleKey: 'my_plan.addons.collaborators.title',
    descriptionKey: 'my_plan.addons.collaborators.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.collaborators.access_by_legend`} />,
    periodKey: 'my_plan.addons.collaborators.collaborator_legend',
    getPrice: () => {
      return 10;
    } /* As collaborators add-on has a fixed price, we return it directly without making an API call */,
  },
  {
    id: 'list-conditioning',
    icon: 'dpicon iconapp-checklist',
    titleKey: 'my_plan.addons.list_conditioning.title',
    descriptionKey: 'my_plan.addons.list_conditioning.description',
    priceLabelKey: (
      <FormattedMessage
        id={`my_plan.addons.list_conditioning.from_contact_legend`}
        values={{
          contacts: 2499,
        }}
      />
    ),
    periodKey: 'my_plan.addons.list_conditioning.price_legend',
    getPrice: () => {
      return 0.008;
    } /* As list conditioning add-on has a fixed price, we return it directly without making an API call */,
  },
  {
    id: 'custom-reports',
    icon: 'dpicon iconapp-growth-chart',
    titleKey: 'my_plan.addons.custom_reports.title',
    descriptionKey: 'my_plan.addons.custom_reports.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.custom_reports.monthly_report_legend`} />,
    periodKey: 'my_plan.addons.custom_reports.monthly_legend',
    getPrice: () => {
      return 50;
    } /* As custom reports add-on has a fixed price, we return it directly without making an API call */,
  },
  {
    id: 'layout-service',
    icon: 'dpicon iconapp-source-file',
    titleKey: 'my_plan.addons.layout_service.title',
    descriptionKey: 'my_plan.addons.layout_service.description',
    priceLabelKey: (
      <FormattedMessage id={`my_plan.addons.layout_service.editor_piece_from_legend`} />
    ),
    periodKey: 'my_plan.addons.layout_service.editor_piece_legend',
    getPrice: () => {
      return 80;
    } /* As layout service add-on has a fixed price, we return it directly without making an API call */,
  },
  {
    id: 'dedicated-environment',
    icon: 'dpicon iconapp-computer-setting',
    titleKey: 'my_plan.addons.dedicated_environment.title',
    descriptionKey: 'my_plan.addons.dedicated_environment.description',
    priceLabelKey: (
      <FormattedMessage id={`my_plan.addons.dedicated_environment.access_by_legend`} />
    ),
    periodKey: 'my_plan.addons.dedicated_environment.month_legend',
    getPrice: () => {
      return 150;
    } /* As dedicated environment add-on has a fixed price, we return it directly without making an API call */,
  },
  {
    id: 'dedicated-ip',
    icon: 'dpicon iconapp-dataserver',
    titleKey: 'my_plan.addons.dedicated_ip.title',
    descriptionKey: 'my_plan.addons.dedicated_ip.description',
    priceLabelKey: <FormattedMessage id={`my_plan.addons.dedicated_ip.access_by_legend`} />,
    periodKey: 'my_plan.addons.dedicated_ip.month_legend',
    getPrice: () => {
      return 30;
    } /* As dedicated ip add-on has a fixed price, we return it directly without making an API call */,
  },
];

const AddOnCard = ({ addOn, price }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);
  const hasNewFeatureRibbon = addOn.isNewFeature;
  const hasBetaBadge = addOn.isBeta === true;
  const hasPrice = Number.isFinite(price) && price > 0;

  return (
    <article
      className="dp-card-addons dp-new-plan-selection-addon-card"
      data-testid={`dp-addon-card-${addOn.id}`}
    >
      {hasNewFeatureRibbon && (
        <div role="alert" className="dp-new-plan-selection-addon-ribbon">
          <span>{_('my_plan.addons.new_feature_label')}</span>
        </div>
      )}
      <header>
        <h3 className="card-title">
          <div className="icon-container">
            <span className={`p-l-6 ${addOn.icon}`} aria-hidden="true"></span>
          </div>
          <span className="dp-new-plan-selection-addon-title-copy">
            <span className="p-l-8 m-l-6">{_(addOn.titleKey)}</span>
            {hasBetaBadge && (
              <span className="dp-new-plan-selection-addon-beta">
                {_('my_plan.addons.beta_label')}
              </span>
            )}
          </span>
        </h3>
      </header>
      <p className="dp-description-legend">{_(addOn.descriptionKey)}</p>
      <div className="dp-new-plan-selection-addon-price">
        <span className="dp-legend-price">{addOn.priceLabelKey}</span>
        {hasPrice && hasBetaBadge ? (
          <>
            <p className="dp-new-plan-selection-addon-beta-price">
              <b>
                US${' '}
                <FormattedNumber value={0} minimumFractionDigits={2} maximumFractionDigits={2} />
              </b>
              <span className="dp-disclaimer">{_(addOn.periodKey)}</span>
              <span className="dp-new-plan-selection-addon-regular-price">
                {_('my_plan.addons.regular_price_label')}{' '}
                <span className="dp-line-through">
                  US${' '}
                  <FormattedNumber
                    value={price}
                    minimumFractionDigits={2}
                    maximumFractionDigits={2}
                  />
                </span>
                <span className="dp-disclaimer">{_(addOn.periodKey)}</span>
              </span>
            </p>
          </>
        ) : hasPrice ? (
          <>
            <p>
              <b>
                US${' '}
                <FormattedNumber
                  value={price}
                  minimumFractionDigits={2}
                  maximumFractionDigits={3}
                />
              </b>{' '}
              <span className="dp-disclaimer">{_(addOn.periodKey)}</span>
            </p>
          </>
        ) : (
          <span className="dp-disclaimer">
            <FormattedMessage id="buy_process.new_plan_selection.addons_section.price_unavailable" />
          </span>
        )}
      </div>
    </article>
  );
};

export const AddOnsSection = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerAccountPlansApiClient } }) => {
    const intl = useIntl();
    const canShowEcoIA = appSessionRef.current.userData.features?.ecoIAEnabled === true;
    const canShowPushNotification =
      process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN === 'true';
    const addOns = useMemo(
      () => getAddonConfigs({ canShowEcoIA, canShowPushNotification }),
      [canShowEcoIA, canShowPushNotification],
    );
    const [prices, setPrices] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxIndex = Math.max(addOns.length - CARDS_PER_PAGE, 0);
    const visibleAddOns = addOns.slice(currentIndex, currentIndex + CARDS_PER_PAGE);
    const hasAvailablePrice = Object.values(prices).some(
      (price) => Number.isFinite(price) && price > 0,
    );

    useEffect(() => {
      let isMounted = true;

      const fetchPrices = async () => {
        setIsLoading(true);

        const responses = await Promise.allSettled(
          addOns.map(async (addOn) => ({
            id: addOn.id,
            price: await addOn.getPrice(dopplerAccountPlansApiClient),
          })),
        );

        if (!isMounted) {
          return;
        }

        setPrices(
          responses.reduce((acc, response) => {
            if (response.status === 'fulfilled') {
              acc[response.value.id] = response.value.price;
            }

            return acc;
          }, {}),
        );
        setIsLoading(false);
      };

      fetchPrices();

      return () => {
        isMounted = false;
      };
    }, [addOns, dopplerAccountPlansApiClient]);

    useEffect(() => {
      setCurrentIndex((index) => Math.min(index, maxIndex));
    }, [maxIndex]);

    const handlePrevious = () => {
      setCurrentIndex((index) => Math.max(index - 1, 0));
    };

    const handleNext = () => {
      setCurrentIndex((index) => Math.min(index + 1, maxIndex));
    };

    if (!addOns.length) {
      return null;
    }

    return (
      <section
        className="dp-new-plan-selection-addons"
        data-testid="dp-addons-section"
        aria-busy={isLoading}
      >
        <header className="dp-new-plan-selection-addons-header">
          <h2 className="dp-second-order-title">
            <FormattedMessage id="buy_process.new_plan_selection.addons_section.title" />
          </h2>
          <p>
            <FormattedMessage id="buy_process.new_plan_selection.addons_section.subtitle" />
          </p>
        </header>
        {!isLoading && !hasAvailablePrice ? (
          <p className="dp-new-plan-selection-addons-empty">
            <FormattedMessage id="buy_process.new_plan_selection.addons_section.empty_message" />
          </p>
        ) : (
          <div className="dp-new-plan-selection-addons-carousel">
            <button
              type="button"
              className="ms-icon icon-arrow-prev dp-arrow-left"
              aria-label={intl.formatMessage({
                id: 'buy_process.new_plan_selection.addons_section.previous',
              })}
              disabled={currentIndex === 0}
              onClick={handlePrevious}
            ></button>
            <div className="dp-new-plan-selection-addons-cards">
              {visibleAddOns.map((addOn) => (
                <AddOnCard key={addOn.id} addOn={addOn} price={prices[addOn.id]} />
              ))}
            </div>
            <button
              type="button"
              className="ms-icon icon-arrow-next dp-arrow-right"
              aria-label={intl.formatMessage({
                id: 'buy_process.new_plan_selection.addons_section.next',
              })}
              disabled={currentIndex >= maxIndex}
              onClick={handleNext}
            ></button>
          </div>
        )}
      </section>
    );
  },
);
