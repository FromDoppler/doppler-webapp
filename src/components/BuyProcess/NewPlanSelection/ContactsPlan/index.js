import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';
import { amountByPlanType, thousandSeparatorNumber } from '../../../../utils';
import {
  mapDiscount,
  orderAscendingDiscount,
} from '../../PlanSelection/reducers/plansByTypeReducer';
import { PaymentFrequency } from '../PaymentFrequency';
import { Promocode } from '../Promocode';

const numberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
};

const getFormattedPriceOptions = (value) => ({
  ...numberFormatOptions,
  minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
});

const MORE_THAN_100K_OPTION_VALUE = 'more-than-100000';

const getCheckoutUrl = ({ search, selectedPlan, selectedPaymentFrequency, promocodeApplied }) => {
  const params = new URLSearchParams(search);
  params.set('selected-plan', selectedPlan.id);
  params.delete('promo-code');
  params.delete('Promo-code');
  params.delete('PromoCode');

  if (selectedPaymentFrequency?.id) {
    params.set('discountId', selectedPaymentFrequency.id);
  } else {
    params.delete('discountId');
  }

  if (selectedPaymentFrequency?.numberMonths) {
    params.set('monthPlan', selectedPaymentFrequency.numberMonths);
  } else {
    params.delete('monthPlan');
  }

  if (promocodeApplied?.canApply && promocodeApplied.promocode) {
    params.set('PromoCode', promocodeApplied.promocode);
  }

  return `/checkout/premium/${PLAN_TYPE.byContact}?${params.toString()}&buyType=1`;
};

export const ContactsPlan = InjectAppServices(
  ({
    plans,
    selectedPlanIndex,
    isMoreThan100kSelected,
    onPlanChange,
    onStickySummaryChange,
    sessionPlan,
    selectedPlan,
    search,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id }, values);
    const isFreeAccount = sessionPlan?.plan?.isFreeAccount;
    const isEqualPlan = sessionPlan?.plan?.idPlan === selectedPlan?.id;
    const isTailoredPlan = isMoreThan100kSelected;
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState(null);
    const [defaultPromocodeDismissed, setDefaultPromocodeDismissed] = useState(false);
    const clearPromocodeInputRef = useRef(null);

    const paymentFrequencies = useMemo(
      () => selectedPlan?.billingCycleDetails?.map(mapDiscount).sort(orderAscendingDiscount) ?? [],
      [selectedPlan],
    );

    useEffect(() => {
      const fetchAmountDetails = async () => {
        try {
          const amountDetails = await dopplerAccountPlansApiClient.getPlanBillingDetailsData(
            selectedPlan.id,
            'Marketing',
            selectedPaymentFrequency?.id ?? 0,
            promocodeApplied?.canApply ? promocodeApplied.promocode : '',
          );
          setAmountDetailsData(amountDetails);
        } catch (error) {
          setAmountDetailsData(null);
        }
      };

      if (selectedPlan?.id) {
        fetchAmountDetails();
      }
    }, [dopplerAccountPlansApiClient, promocodeApplied, selectedPaymentFrequency, selectedPlan]);

    const handlePaymentFrequencyChange = useCallback(({ selectedPaymentFrequency }) => {
      setSelectedPaymentFrequency(selectedPaymentFrequency);
    }, []);

    const handlePromocodeApplied = useCallback((promotion) => {
      setPromocodeApplied(promotion && typeof promotion === 'object' ? promotion : null);
    }, []);

    const handleRemovePromocodeApplied = useCallback(() => {
      clearPromocodeInputRef.current?.();
      setDefaultPromocodeDismissed(true);
      setPromocodeApplied(null);
    }, []);

    const handleManualPromocodeIntervention = useCallback(() => {
      setDefaultPromocodeDismissed(true);
    }, []);

    const registerClearPromocodeInput = useCallback((clearPromocodeInput) => {
      clearPromocodeInputRef.current = clearPromocodeInput;
    }, []);

    const selectedDiscountPercentage = selectedPaymentFrequency?.discountPercentage ?? 0;
    const selectedNumberMonths = selectedPaymentFrequency?.numberMonths ?? 1;
    const selectedSubscriptionType = selectedPaymentFrequency?.subscriptionType ?? null;
    const selectedPlanFee = selectedPlan?.fee ?? 0;
    const monthlyPrice = selectedPlanFee * (1 - selectedDiscountPercentage / 100);
    const periodTotal = monthlyPrice * selectedNumberMonths;
    const promocodeDiscount = amountDetailsData?.value?.discountPromocode ?? null;
    const promocodeDiscountPercentage = promocodeDiscount?.discountPercentage ?? 0;
    const promocodeDuration =
      promocodeApplied?.promotionApplied?.duration ?? promocodeDiscount?.duration ?? 0;
    const hasPromocodeDiscount = Boolean(
      promocodeApplied?.canApply && promocodeDiscountPercentage > 0 && !isMoreThan100kSelected,
    );
    const displayedMonthlyPrice =
      hasPromocodeDiscount && typeof amountDetailsData?.value?.nextMonthTotal === 'number'
        ? amountDetailsData.value.nextMonthTotal
        : monthlyPrice;
    const canChoosePlan = selectedPlan && !isEqualPlan;
    const checkoutUrl = selectedPlan
      ? getCheckoutUrl({ search, selectedPlan, selectedPaymentFrequency, promocodeApplied })
      : '#';
    const stickyContactsLabel = selectedPlan
      ? thousandSeparatorNumber(intl.defaultLocale, amountByPlanType(selectedPlan))
      : '';

    const stickyDiscountSummary = useMemo(() => {
      if (isTailoredPlan) {
        return null;
      }

      if (hasPromocodeDiscount) {
        return {
          type: 'promocode',
          percentage: promocodeDiscountPercentage,
          months: promocodeDuration,
        };
      }

      if (selectedDiscountPercentage > 0 && selectedSubscriptionType) {
        return {
          type: 'frequency',
          percentage: selectedDiscountPercentage,
          period: intl.formatMessage({
            id: `buy_process.new_plan_selection.payment_period_${selectedSubscriptionType.replace(
              '-',
              '_',
            )}`,
          }),
          total: periodTotal,
        };
      }

      return null;
    }, [
      hasPromocodeDiscount,
      intl,
      isTailoredPlan,
      periodTotal,
      promocodeDiscountPercentage,
      promocodeDuration,
      selectedDiscountPercentage,
      selectedSubscriptionType,
    ]);

    const stickySummaryData = useMemo(
      () => ({
        contactsLabel: stickyContactsLabel,
        ctaHref: isTailoredPlan ? '/upgrade-suggestion-form' : checkoutUrl,
        discountSummary: stickyDiscountSummary,
        displayPrice: displayedMonthlyPrice,
        isCustomPlan: isTailoredPlan,
        isDisabled: !isTailoredPlan && !canChoosePlan,
      }),
      [
        canChoosePlan,
        checkoutUrl,
        displayedMonthlyPrice,
        isTailoredPlan,
        stickyContactsLabel,
        stickyDiscountSummary,
      ],
    );

    useEffect(() => {
      onStickySummaryChange?.(stickySummaryData);
    }, [onStickySummaryChange, stickySummaryData]);

    return (
      <section className="dp-new-plan-selection-card" data-testid="dp-contacts-plan">
        <div className="dp-new-plan-selection-card-header">
          <div>
            <div className="dp-new-plan-selection-plan-title">
              <h1 className="p-b-0">
                <FormattedMessage id="buy_process.new_plan_selection.contacts_plan_title" />
              </h1>
              <span className="dp-new-plan-selection-badge">
                <FormattedMessage id="buy_process.new_plan_selection.popular_label" />
              </span>
            </div>
            <p>
              <FormattedMessage id="buy_process.new_plan_selection.contacts_plan_description" />
            </p>
          </div>
        </div>

        <div className="dp-rowflex dp-new-plan-selection-main">
          <div className="col-lg-6 col-md-12">
            <div className="dp-new-plan-selection-fields">
              <div className="dp-new-plan-selection-select-wrap">
                <h2 className="labelcontrol">
                  <FormattedMessage id="buy_process.new_plan_selection.contacts_label" />
                </h2>
                <span className="dropdown-arrow" />
                <select
                  id="new-plan-selection-contacts"
                  className="dp-new-plan-selection-select"
                  value={isMoreThan100kSelected ? MORE_THAN_100K_OPTION_VALUE : selectedPlanIndex}
                  onChange={onPlanChange}
                >
                  {plans.map((plan, index) => {
                    const amount = thousandSeparatorNumber(
                      intl.defaultLocale,
                      amountByPlanType(plan),
                    );
                    return (
                      <option key={`${plan.id}-${amount}`} value={index}>
                        {_('buy_process.new_plan_selection.contacts_option', {
                          contacts: amount,
                        })}
                      </option>
                    );
                  })}
                  <option value={MORE_THAN_100K_OPTION_VALUE}>
                    {_('buy_process.new_plan_selection.contacts_option_more_than_100k')}
                  </option>
                </select>
              </div>
              <div className="dp-new-plan-selection-payment-frequency">
                <PaymentFrequency
                  paymentFrequenciesList={paymentFrequencies}
                  onSelectPaymentFrequency={handlePaymentFrequencyChange}
                  currentSubscriptionUser={sessionPlan.plan.planSubscription}
                  disabled={!isFreeAccount || isEqualPlan}
                />
              </div>
              <div className="dp-new-plan-selection-promocode">
                <Promocode
                  allowPromocode={
                    !selectedPaymentFrequency?.id || selectedPaymentFrequency?.applyPromo
                  }
                  selectedMarketingPlan={selectedPlan}
                  amountDetailsData={amountDetailsData}
                  selectedPaymentFrequency={selectedPaymentFrequency}
                  callback={handlePromocodeApplied}
                  hasPromocodeAppliedItem={Boolean(promocodeApplied?.promocode)}
                  isArgentina={sessionPlan.locationCountry === 'ar'}
                  isFreeAccount={isFreeAccount}
                  disabledPromocode={false}
                  handleRemovePromocodeApplied={handleRemovePromocodeApplied}
                  currentPromocodeApplied={promocodeApplied}
                  registerClearPromocodeInput={registerClearPromocodeInput}
                  defaultPromocodeDismissed={defaultPromocodeDismissed}
                  handleManualPromocodeIntervention={handleManualPromocodeIntervention}
                />
              </div>
              {isMoreThan100kSelected && (
                <div
                  className="dp-wrap-message dp-wrap-info dp-new-plan-selection-more-than-message"
                  data-testid="dp-more-than-100k-message"
                >
                  <span className="dp-message-icon" />
                  <div className="dp-content-message">
                    <p>
                      <FormattedMessage id="buy_process.new_plan_selection.more_than_100k_info_message" />
                    </p>
                  </div>
                  <Link
                    to="/upgrade-suggestion-form"
                    className="dp-new-plan-selection-more-than-link"
                  >
                    <FormattedMessage id="buy_process.new_plan_selection.more_than_100k_contact_link" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <aside className="col-lg-6 col-md-12 dp-new-plan-selection-price" aria-live="polite">
            <span className="dp-new-plan-selection-price-label">
              <FormattedMessage id="buy_process.new_plan_selection.price_label" />
            </span>
            {isTailoredPlan ? (
              <div className="dp-new-plan-selection-price-value dp-new-plan-selection-custom-price">
                <FormattedMessage id="buy_process.new_plan_selection.custom_price_value" />
              </div>
            ) : (
              <div className="dp-new-plan-selection-price-value">
                US$
                <FormattedNumber
                  value={displayedMonthlyPrice}
                  {...getFormattedPriceOptions(displayedMonthlyPrice)}
                />
                <span className="dp-new-plan-selection-price-period">
                  /<FormattedMessage id="buy_process.new_plan_selection.month_period" />*
                </span>
              </div>
            )}

            {!isTailoredPlan && hasPromocodeDiscount && (
              <div className="dp-new-plan-selection-price-detail">
                <p>
                  <span className="dp-new-plan-selection-old-price">
                    US$
                    <FormattedNumber
                      value={monthlyPrice}
                      {...getFormattedPriceOptions(monthlyPrice)}
                    />
                    /<FormattedMessage id="buy_process.new_plan_selection.month_period" />
                  </span>
                  <span> </span>
                  <span className="dp-new-plan-selection-savings">
                    <FormattedMessage
                      id="buy_process.new_plan_selection.promocode_savings_text"
                      values={{
                        percentage: promocodeDiscountPercentage,
                        months: promocodeDuration,
                      }}
                    />
                  </span>
                </p>
              </div>
            )}

            {!isTailoredPlan && !hasPromocodeDiscount && selectedDiscountPercentage > 0 && (
              <div className="dp-new-plan-selection-price-detail">
                <p>
                  <span className="dp-new-plan-selection-old-price">
                    US$
                    <FormattedNumber
                      value={selectedPlanFee}
                      {...getFormattedPriceOptions(selectedPlanFee)}
                    />
                    /<FormattedMessage id="buy_process.new_plan_selection.month_period" />
                  </span>
                  <span> </span>
                  <span className="dp-new-plan-selection-savings">
                    <FormattedMessage
                      id="buy_process.new_plan_selection.savings_text"
                      values={{
                        percentage: selectedDiscountPercentage,
                        currency: 'US$',
                        period: _(
                          `buy_process.new_plan_selection.payment_period_${selectedPaymentFrequency.subscriptionType.replace(
                            '-',
                            '_',
                          )}`,
                        ),
                        total: (
                          <FormattedNumber
                            value={periodTotal}
                            {...getFormattedPriceOptions(periodTotal)}
                          />
                        ),
                      }}
                    />
                  </span>
                </p>
              </div>
            )}

            {isTailoredPlan ? (
              <Link
                className="dp-button button-medium primary-green dp-new-plan-selection-contact-advisor-cta"
                to="/upgrade-suggestion-form"
              >
                <FormattedMessage id="buy_process.new_plan_selection.contact_advisor_cta" />
              </Link>
            ) : canChoosePlan ? (
              <a className="dp-button button-medium primary-green" href={checkoutUrl}>
                <FormattedMessage id="buy_process.new_plan_selection.choose_plan" />
              </a>
            ) : (
              <button type="button" className="dp-button button-medium primary-green" disabled>
                <FormattedMessage id="buy_process.new_plan_selection.choose_plan" />
              </button>
            )}

            <p className="dp-new-plan-selection-disclaimer">
              <span>
                <FormattedMessage id="buy_process.shopping_cart.price_without_taxes" />
              </span>
              <span> </span>
              <span>
                <FormattedMessage id="buy_process.shopping_cart.renewal_description" />
              </span>
            </p>
          </aside>
        </div>
      </section>
    );
  },
);
