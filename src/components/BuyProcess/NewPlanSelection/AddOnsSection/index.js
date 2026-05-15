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
          priceLabelKey: 'my_plan.addons.eco_ai.access_by_legend',
          periodKey: 'my_plan.addons.eco_ai.month_legend',
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
    priceLabelKey: 'my_plan.addons.conversations.plans_from_legend',
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
          priceLabelKey: 'my_plan.addons.push_notification.plans_from_legend',
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
    priceLabelKey: 'my_plan.addons.onsite.plans_from_legend',
    periodKey: 'my_plan.addons.onsite.month_legend',
    getPrice: (dopplerAccountPlansApiClient) =>
      getAddOnPlansPrice(dopplerAccountPlansApiClient, AddOnType.OnSite),
  },
  {
    id: 'landing-pages',
    icon: 'dpicon iconapp-landing-page',
    titleKey: 'my_plan.addons.landing_pages.title',
    descriptionKey: 'my_plan.addons.landing_pages.description',
    priceLabelKey: 'my_plan.addons.landing_pages.packs_from_legend',
    periodKey: 'my_plan.addons.landing_pages.month_legend',
    getPrice: getLandingPacksPrice,
  },
];

const AddOnCard = ({ addOn, price }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);

  return (
    <article
      className="dp-card-addons dp-new-plan-selection-addon-card"
      data-testid={`dp-addon-card-${addOn.id}`}
    >
      <header>
        <h3 className="card-title">
          <div className="icon-container">
            <span className={`p-l-6 ${addOn.icon}`} aria-hidden="true"></span>
          </div>
          <span className="p-l-8 m-l-6">{_(addOn.titleKey)}</span>
        </h3>
      </header>
      <p className="dp-description-legend">{_(addOn.descriptionKey)}</p>
      <div className="dp-new-plan-selection-addon-price">
        <span className="dp-legend-price">{_(addOn.priceLabelKey)}</span>
        {price ? (
          <>
            <p>
              <b>
                US${' '}
                <FormattedNumber
                  value={price}
                  minimumFractionDigits={2}
                  maximumFractionDigits={2}
                />
              </b>
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
