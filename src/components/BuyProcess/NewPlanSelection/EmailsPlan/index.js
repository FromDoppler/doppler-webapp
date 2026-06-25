import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';
import { amountByPlanType, thousandSeparatorNumber, unitPriceDecimals } from '../../../../utils';
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

const getSessionPromocodeApplied = (sessionPlan) => {
  const promotion = sessionPlan?.plan?.promotion;
  const sanitizeCode = (value) =>
    value === undefined || value === null ? '' : String(value).trim();
  const promocode =
    sanitizeCode(promotion?.code) ||
    sanitizeCode(promotion?.promocode) ||
    sanitizeCode(promotion?.promoCode) ||
    sanitizeCode(sessionPlan?.plan?.promotionCode) ||
    sanitizeCode(sessionPlan?.plan?.promocode);

  if (!promocode) {
    return null;
  }

  return {
    canApply: true,
    promocode,
    promotionApplied: {
      discountPercentage: promotion?.discount ?? 0,
      duration: promotion?.duration ?? 0,
    },
  };
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

  return `/checkout/premium/${PLAN_TYPE.byEmail}?${params.toString()}&buyType=1`;
};

export const EmailsPlan = InjectAppServices(
  ({
    plans,
    selectedPlanIndex,
    isLessThan100kSelected,
    isMoreThan10mSelected,
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
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState(null);
    const [defaultPromocodeDismissed, setDefaultPromocodeDismissed] = useState(false);
    const clearPromocodeInputRef = useRef(null);
    const sessionPromocodeApplied = useMemo(
      () => getSessionPromocodeApplied(sessionPlan),
      [sessionPlan],
    );
    const effectivePromocodeApplied =
      promocodeApplied ?? (!defaultPromocodeDismissed ? sessionPromocodeApplied : null);

    useEffect(() => {
      const fetchAmountDetails = async () => {
        try {
          const amountDetails = await dopplerAccountPlansApiClient.getPlanBillingDetailsData(
            selectedPlan.id,
            'Marketing',
            0,
            effectivePromocodeApplied?.canApply ? effectivePromocodeApplied.promocode : '',
          );
          setAmountDetailsData(amountDetails);
        } catch (error) {
          setAmountDetailsData(null);
        }
      };

      if (selectedPlan?.id) {
        fetchAmountDetails();
      }
    }, [dopplerAccountPlansApiClient, effectivePromocodeApplied, selectedPlan]);

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

    const promocodeDiscount = amountDetailsData?.value?.discountPromocode ?? null;
    const promocodeDiscountPercentage = promocodeDiscount?.discountPercentage ?? 0;
    const selectedPlanFee = selectedPlan?.fee ?? 0;
    const hasPromocodeDiscount = Boolean(
      effectivePromocodeApplied?.canApply &&
      promocodeDiscountPercentage > 0 &&
      !isLessThan100kSelected &&
      !isMoreThan10mSelected,
    );
    const displayedMonthlyPrice =
      hasPromocodeDiscount && typeof amountDetailsData?.value?.nextMonthTotal === 'number'
        ? amountDetailsData.value.nextMonthTotal
        : selectedPlanFee;
    const canChoosePlan = selectedPlan && !isEqualPlan;
    const checkoutUrl = selectedPlan
      ? getCheckoutUrl({
          search,
          selectedPlan,
          promocodeApplied: effectivePromocodeApplied,
        })
      : '#';
    const stickyEmailsLabel = selectedPlan
      ? thousandSeparatorNumber(intl.defaultLocale, amountByPlanType(selectedPlan))
      : '';
    const currentSessionEmailPlan =
      plans.find((plan) => plan.id === sessionPlan?.plan?.idPlan) ?? null;
    const currentSessionEmailCapacity = amountByPlanType(currentSessionEmailPlan ?? {});
    const selectedEmailCapacity = amountByPlanType(selectedPlan ?? {});
    const shouldShowDowngradeWarning =
      !isMoreThan10mSelected &&
      (isLessThan100kSelected ||
        (!isFreeAccount &&
          sessionPlan?.plan?.planType === PLAN_TYPE.byEmail &&
          currentSessionEmailCapacity > 0 &&
          selectedEmailCapacity > 0 &&
          selectedEmailCapacity < currentSessionEmailCapacity));
    const shouldShowHighVolumeMessage = isMoreThan10mSelected;
    const shouldShowCustomPrice = isLessThan100kSelected || isMoreThan10mSelected;
    const shouldUseAdvisorCta = shouldShowDowngradeWarning || shouldShowHighVolumeMessage;
    const shouldShowCurrentPlanWarning =
      !isFreeAccount &&
      sessionPlan?.plan?.planType === PLAN_TYPE.byEmail &&
      isEqualPlan &&
      !shouldUseAdvisorCta;
    const shouldShowPromocode = !shouldUseAdvisorCta && !shouldShowCurrentPlanWarning;
    const extraEmailPrice = selectedPlan?.extraEmailPrice ?? 0;

    const stickyDiscountSummary = useMemo(() => {
      if (!shouldShowPromocode || !hasPromocodeDiscount) {
        return null;
      }

      return {
        type: 'promocode',
        percentage: promocodeDiscountPercentage,
        months: 0,
      };
    }, [hasPromocodeDiscount, promocodeDiscountPercentage, shouldShowPromocode]);

    const stickySummaryData = useMemo(
      () => ({
        amountLabel: stickyEmailsLabel,
        ctaHref: shouldUseAdvisorCta ? '/upgrade-suggestion-form' : checkoutUrl,
        discountSummary: stickyDiscountSummary,
        displayPrice: displayedMonthlyPrice,
        isCustomPlan: false,
        isDisabled: !shouldUseAdvisorCta && !canChoosePlan,
        planType: PLAN_TYPE.byEmail,
        previousPrice: selectedPlanFee,
        useAdvisorCta: shouldUseAdvisorCta,
      }),
      [
        canChoosePlan,
        checkoutUrl,
        displayedMonthlyPrice,
        selectedPlanFee,
        shouldUseAdvisorCta,
        stickyDiscountSummary,
        stickyEmailsLabel,
      ],
    );

    useEffect(() => {
      onStickySummaryChange?.(stickySummaryData);
    }, [onStickySummaryChange, stickySummaryData]);

    return (
      <section className="dp-new-plan-selection-card" data-testid="dp-emails-plan">
        <div className="dp-new-plan-selection-card-header">
          <div>
            <div className="dp-new-plan-selection-plan-title">
              <h1 className="p-b-0">
                <FormattedMessage id="buy_process.new_plan_selection.emails_plan_title" />
              </h1>
            </div>
            <p>
              <FormattedMessage
                id="buy_process.new_plan_selection.emails_plan_description"
                values={{ br: <br /> }}
              />
            </p>
          </div>
        </div>

        <div className="dp-rowflex dp-new-plan-selection-main">
          <div className="col-lg-6 col-md-12">
            <div className="dp-new-plan-selection-fields">
              <div className="dp-new-plan-selection-select-wrap">
                <h2 className="labelcontrol">
                  <FormattedMessage id="buy_process.new_plan_selection.emails_label" />
                </h2>
                <span className="dropdown-arrow" />
                <select
                  id="new-plan-selection-emails"
                  className="dp-new-plan-selection-select"
                  value={
                    isMoreThan10mSelected
                      ? 'more-than-10000000'
                      : isLessThan100kSelected
                        ? 'less-than-100000'
                        : selectedPlanIndex
                  }
                  onChange={onPlanChange}
                >
                  <option value="less-than-100000">
                    {_('buy_process.new_plan_selection.emails_option_less_than_100k')}
                  </option>
                  {plans.map((plan, index) => {
                    const amount = thousandSeparatorNumber(
                      intl.defaultLocale,
                      amountByPlanType(plan),
                    );
                    return (
                      <option key={`${plan.id}-${amount}`} value={index}>
                        {_('buy_process.new_plan_selection.emails_option', {
                          emails: amount,
                        })}
                      </option>
                    );
                  })}
                  <option value="more-than-10000000">
                    {_('buy_process.new_plan_selection.emails_option_more_than_10m')}
                  </option>
                </select>
              </div>

              {shouldShowPromocode && (
                <div className="dp-new-plan-selection-promocode">
                  <Promocode
                    allowPromocode={true}
                    selectedMarketingPlan={selectedPlan}
                    amountDetailsData={amountDetailsData}
                    selectedPaymentFrequency={undefined}
                    callback={handlePromocodeApplied}
                    hasPromocodeAppliedItem={Boolean(effectivePromocodeApplied?.promocode)}
                    isArgentina={sessionPlan.locationCountry === 'ar'}
                    isFreeAccount={isFreeAccount}
                    defaultPromocode={null}
                    disabledPromocode={false}
                    handleRemovePromocodeApplied={handleRemovePromocodeApplied}
                    currentPromocodeApplied={effectivePromocodeApplied}
                    registerClearPromocodeInput={registerClearPromocodeInput}
                    defaultPromocodeDismissed={defaultPromocodeDismissed}
                    handleManualPromocodeIntervention={handleManualPromocodeIntervention}
                  />
                </div>
              )}

              {shouldShowHighVolumeMessage && (
                <div
                  className="dp-wrap-message dp-wrap-info dp-new-plan-selection-more-than-message"
                  data-testid="dp-emails-more-than-10m-message"
                >
                  <span className="dp-message-icon" />
                  <div className="dp-content-message">
                    <p>
                      <FormattedMessage
                        id="buy_process.new_plan_selection.emails_more_than_10m_info_message"
                        values={{ br: <br />, bold: (chunks) => <b>{chunks}</b> }}
                      />
                    </p>
                    <Link
                      to="/upgrade-suggestion-form"
                      className="dp-new-plan-selection-more-than-link"
                    >
                      <FormattedMessage id="buy_process.new_plan_selection.more_than_100k_contact_link" />
                    </Link>
                  </div>
                </div>
              )}

              {shouldShowDowngradeWarning && (
                <div
                  className="dp-wrap-message dp-wrap-info dp-new-plan-selection-more-than-message"
                  data-testid="dp-emails-downgrade-message"
                >
                  <span className="dp-message-icon" />
                  <div className="dp-content-message">
                    <p>
                      <FormattedMessage
                        id="buy_process.new_plan_selection.emails_downgrade_warning_message"
                        values={{ br: <br />, bold: (chunks) => <b>{chunks}</b> }}
                      />
                    </p>
                    <Link
                      to="/upgrade-suggestion-form"
                      className="dp-new-plan-selection-more-than-link"
                    >
                      <FormattedMessage id="buy_process.new_plan_selection.more_than_100k_contact_link" />
                    </Link>
                  </div>
                </div>
              )}
              {shouldShowCurrentPlanWarning && (
                <div
                  className="dp-wrap-message dp-wrap-info dp-new-plan-selection-more-than-message"
                  data-testid="dp-emails-current-plan-message"
                >
                  <span className="dp-message-icon" />
                  <div className="dp-content-message dp-content-full">
                    <p>
                      <FormattedMessage id="buy_process.new_plan_selection.contacts_current_plan_warning_message" />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="col-lg-6 col-md-12 dp-new-plan-selection-price" aria-live="polite">
            <span className="dp-new-plan-selection-price-label">
              <FormattedMessage id="buy_process.new_plan_selection.price_label" />
            </span>
            {shouldShowCustomPrice ? (
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

            {!shouldShowCustomPrice && !shouldUseAdvisorCta && hasPromocodeDiscount && (
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
                      id="buy_process.new_plan_selection.promocode_savings_text"
                      values={{
                        percentage: promocodeDiscountPercentage,
                        months: 1,
                      }}
                    />
                  </span>
                </p>
              </div>
            )}

            {shouldUseAdvisorCta ? (
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
              {shouldShowCustomPrice ? (
                <FormattedMessage
                  id="buy_process.new_plan_selection.tailored_plan_disclaimer"
                  values={{ br: <br /> }}
                />
              ) : (
                <>
                  <span>
                    <FormattedMessage id="buy_process.shopping_cart.price_without_taxes" />
                  </span>
                  <span> </span>
                  <span>
                    <FormattedMessage id="buy_process.shopping_cart.renewal_description" />
                  </span>
                  <br />
                  <b>
                    <FormattedMessage
                      id="buy_process.new_plan_selection.emails_extra_email_price"
                      values={{
                        price: unitPriceDecimals(extraEmailPrice),
                      }}
                    />
                  </b>
                </>
              )}
            </p>
          </aside>
        </div>
      </section>
    );
  },
);
