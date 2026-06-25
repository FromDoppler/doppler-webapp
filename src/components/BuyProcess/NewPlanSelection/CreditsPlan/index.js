import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';
import { amountByPlanType, getPlanFee, thousandSeparatorNumber } from '../../../../utils';
import { Promocode } from '../Promocode';

const numberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  useGrouping: true,
};

const getFormattedPriceOptions = (value) => ({
  ...numberFormatOptions,
  minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
});

const unitPriceFormatOptions = {
  maximumFractionDigits: 4,
  minimumFractionDigits: 4,
};

const getCheckoutUrl = ({ search, selectedPlan, promocodeApplied }) => {
  const params = new URLSearchParams(search);
  params.set('selected-plan', selectedPlan.id);
  params.delete('promo-code');
  params.delete('Promo-code');
  params.delete('PromoCode');
  params.delete('discountId');
  params.delete('monthPlan');

  if (promocodeApplied?.canApply && promocodeApplied.promocode) {
    params.set('PromoCode', promocodeApplied.promocode);
  }

  return `/checkout/premium/${PLAN_TYPE.byCredit}?${params.toString()}&buyType=1`;
};

export const CreditsPlan = InjectAppServices(
  ({
    plans,
    selectedPlanIndex,
    onPlanChange,
    sessionPlan,
    selectedPlan,
    search,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id }, values);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState(null);
    const [defaultPromocodeDismissed, setDefaultPromocodeDismissed] = useState(false);
    const clearPromocodeInputRef = useRef(null);

    useEffect(() => {
      const fetchAmountDetails = async () => {
        try {
          const amountDetails = await dopplerAccountPlansApiClient.getPlanBillingDetailsData(
            selectedPlan.id,
            'Marketing',
            0,
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
    }, [dopplerAccountPlansApiClient, promocodeApplied, selectedPlan]);

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

    const planFee = getPlanFee(selectedPlan ?? { type: PLAN_TYPE.byCredit, price: 0 });
    const creditsAmount = amountByPlanType(
      selectedPlan ?? { type: PLAN_TYPE.byCredit, credits: 0 },
    );
    const promocodeDiscount = amountDetailsData?.value?.discountPromocode ?? null;
    const promocodeDiscountPercentage = promocodeDiscount?.discountPercentage ?? 0;
    const extraCredits = Math.max(
      promocodeApplied?.promotionApplied?.extraCredits ?? 0,
      promocodeDiscount?.extraCredits ?? 0,
    );
    const hasPromocodeDiscount = Boolean(
      promocodeApplied?.canApply && promocodeDiscountPercentage > 0,
    );
    const hasExtraCredits = Boolean(promocodeApplied?.canApply && extraCredits > 0);
    const displayedPrice =
      hasPromocodeDiscount && typeof amountDetailsData?.value?.total === 'number'
        ? amountDetailsData.value.total
        : planFee;
    const pricePerCredit = creditsAmount > 0 ? displayedPrice / creditsAmount : 0;
    const checkoutUrl = selectedPlan
      ? getCheckoutUrl({ search, selectedPlan, promocodeApplied })
      : '#';

    return (
      <section
        className="dp-new-plan-selection-card dp-new-plan-selection-card-credits"
        data-testid="dp-credits-plan"
      >
        <div className="dp-container dp-new-plan-selection-card-credits-content">
          <div className="dp-new-plan-selection-card-header">
            <div>
              <div className="dp-new-plan-selection-plan-title">
                <h3 className="dp-second-order-title">
                  <FormattedMessage id="buy_process.new_plan_selection.credits_plan_title" />
                </h3>
              </div>
              <p className="dp-new-plan-selection-credits-description">
                <FormattedMessage id="buy_process.new_plan_selection.credits_plan_description" />
              </p>
            </div>
          </div>

          <div className="dp-rowflex dp-new-plan-selection-main dp-new-plan-selection-main-credits">
            <div className="col-lg-5 col-md-12">
              <div className="dp-new-plan-selection-fields dp-new-plan-selection-fields-credits">
                <div className="dp-new-plan-selection-select-wrap">
                  <h2 id="new-plan-selection-credits-label" className="labelcontrol">
                    <FormattedMessage id="buy_process.new_plan_selection.credits_label" />
                  </h2>
                  <span className="dropdown-arrow" />
                  <select
                    id="new-plan-selection-credits"
                    aria-labelledby="new-plan-selection-credits-label"
                    className="dp-new-plan-selection-select"
                    value={selectedPlanIndex}
                    onChange={onPlanChange}
                  >
                    {plans.map((plan, index) => {
                      const amount = thousandSeparatorNumber(
                        intl.defaultLocale,
                        amountByPlanType(plan),
                      );
                      return (
                        <option key={`${plan.id}-${amount}`} value={index}>
                          {_('buy_process.new_plan_selection.credits_option', {
                            credits: amount,
                          })}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="dp-new-plan-selection-promocode">
                  <Promocode
                    allowPromocode={true}
                    selectedMarketingPlan={selectedPlan}
                    amountDetailsData={amountDetailsData}
                    selectedPaymentFrequency={undefined}
                    callback={handlePromocodeApplied}
                    hasPromocodeAppliedItem={Boolean(promocodeApplied?.promocode)}
                    isArgentina={sessionPlan.locationCountry === 'ar'}
                    isFreeAccount={sessionPlan?.plan?.isFreeAccount}
                    defaultPromocode={null}
                    disabledPromocode={false}
                    handleRemovePromocodeApplied={handleRemovePromocodeApplied}
                    currentPromocodeApplied={promocodeApplied}
                    registerClearPromocodeInput={registerClearPromocodeInput}
                    defaultPromocodeDismissed={defaultPromocodeDismissed}
                    handleManualPromocodeIntervention={handleManualPromocodeIntervention}
                  />
                </div>
              </div>
            </div>

            <aside
              className="col-lg-7 col-md-12 dp-new-plan-selection-price dp-new-plan-selection-price-credits"
              aria-live="polite"
            >
              <span className="dp-new-plan-selection-price-label">
                <FormattedMessage id="buy_process.new_plan_selection.price_label" />
              </span>
              <div className="dp-new-plan-selection-price-value">
                US$
                <FormattedNumber
                  value={displayedPrice}
                  {...getFormattedPriceOptions(displayedPrice)}
                />
                <span className="dp-new-plan-selection-price-period">
                  /<FormattedMessage id="buy_process.new_plan_selection.single_payment_period" />*
                </span>
              </div>

              {hasPromocodeDiscount && (
                <div className="dp-new-plan-selection-price-detail">
                  <p>
                    <span className="dp-new-plan-selection-old-price">
                      US$
                      <FormattedNumber value={planFee} {...getFormattedPriceOptions(planFee)} />
                    </span>
                    <span> </span>
                    <span className="dp-new-plan-selection-savings">
                      <FormattedMessage
                        id="buy_process.new_plan_selection.credits_promocode_savings_text"
                        values={{
                          percentage: promocodeDiscountPercentage,
                        }}
                      />
                    </span>
                  </p>
                </div>
              )}

              {hasExtraCredits && (
                <p className="dp-new-plan-selection-savings dp-new-plan-selection-extra-credits-message">
                  <FormattedMessage
                    id="buy_process.new_plan_selection.credits_extra_credits_text"
                    values={{
                      credits: thousandSeparatorNumber(intl.defaultLocale, extraCredits),
                    }}
                  />
                </p>
              )}

              <a className="dp-button button-big secondary-brown button-medium" href={checkoutUrl}>
                <FormattedMessage id="buy_process.new_plan_selection.buy_credits" />
              </a>

              <p className="dp-new-plan-selection-disclaimer dp-new-plan-selection-disclaimer-credits">
                <span>
                  <FormattedMessage id="buy_process.shopping_cart.price_without_taxes" />
                </span>
                <span> </span>
                <span>
                  <FormattedMessage id="buy_process.shopping_cart.credits_renewal_description" />
                </span>
                <br />
                <span>
                  <FormattedMessage
                    id="buy_process.new_plan_selection.credits_price_per_credit"
                    values={{
                      value: <FormattedNumber value={pricePerCredit} {...unitPriceFormatOptions} />,
                    }}
                  />
                </span>
              </p>
            </aside>
          </div>
        </div>
      </section>
    );
  },
);
