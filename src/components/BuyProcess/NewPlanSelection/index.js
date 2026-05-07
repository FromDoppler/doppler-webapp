import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import { InjectAppServices } from '../../../services/pure-di';
import { amountByPlanType, thousandSeparatorNumber } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { GoBackButton } from '../PlanSelection/GoBackButton';
import { mapDiscount, orderDiscount } from '../PlanSelection/reducers/plansByTypeReducer';
import { UnexpectedError } from '../UnexpectedError';
import { PaymentFrequency } from './PaymentFrequency';
import { Promocode } from './Promocode';
import { NewPlanSelectionStyled } from './index.styles';

const numberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
};
const MORE_THAN_100K_OPTION_VALUE = 'more-than-100000';

const getFormattedPriceOptions = (value) => ({
  ...numberFormatOptions,
  minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
});

const getPlanIndexByQueryOrSession = ({ plans, search, sessionPlan }) => {
  const query = new URLSearchParams(search);
  const selectedPlanId = parseInt(query.get('selected-plan'), 10);
  const selectedPlanIndex = plans.findIndex((plan) => plan.id === selectedPlanId);

  if (selectedPlanIndex >= 0) {
    return selectedPlanIndex;
  }

  const currentPlanIndex = plans.findIndex(
    (plan) =>
      sessionPlan?.plan?.planType === PLAN_TYPE.byContact && plan.id === sessionPlan.plan.idPlan,
  );

  return currentPlanIndex >= 0 ? currentPlanIndex : 0;
};

const getCheckoutUrl = ({ search, selectedPlan, selectedPaymentFrequency, promocodeApplied }) => {
  const params = new URLSearchParams(search);
  params.set('selected-plan', selectedPlan.id);

  if (selectedPaymentFrequency?.id) {
    params.set('discountId', selectedPaymentFrequency.id);
  } else {
    params.delete('discountId');
  }

  if (promocodeApplied?.canApply && promocodeApplied.promocode) {
    params.delete('promo-code');
    params.set('PromoCode', promocodeApplied.promocode);
  }

  return `/checkout/premium/${PLAN_TYPE.byContact}?${params.toString()}`;
};

export const NewPlanSelection = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerAccountPlansApiClient, planService } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id }, values);
    const { search } = useLocation();
    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = sessionPlan.plan;
    const [plans, setPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMoreThan100kSelected, setIsMoreThan100kSelected] = useState(false);
    const clearPromocodeInputRef = useRef(null);

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const plansByContact = await planService.getPlansByType(PLAN_TYPE.byContact);
          setPlans(plansByContact);
          setSelectedPlanIndex(
            plansByContact.length
              ? getPlanIndexByQueryOrSession({ plans: plansByContact, search, sessionPlan })
              : 0,
          );
          setIsMoreThan100kSelected(false);
          setHasError(false);
        } catch (error) {
          setHasError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();
    }, [planService, search, sessionPlan]);

    const selectedPlan = plans[selectedPlanIndex] ?? null;

    const paymentFrequencies = useMemo(
      () => selectedPlan?.billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ?? [],
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

    const handlePlanChange = (event) => {
      const { value } = event.target;

      if (value === MORE_THAN_100K_OPTION_VALUE) {
        setIsMoreThan100kSelected(true);
        setSelectedPlanIndex((currentPlanIndex) => Math.max(currentPlanIndex, plans.length - 1));
        return;
      }

      setIsMoreThan100kSelected(false);
      setSelectedPlanIndex(parseInt(value, 10));
    };

    const handlePaymentFrequencyChange = useCallback(({ selectedPaymentFrequency }) => {
      setSelectedPaymentFrequency(selectedPaymentFrequency);
    }, []);

    const handlePromocodeApplied = useCallback((promotion) => {
      setPromocodeApplied(promotion && typeof promotion === 'object' ? promotion : null);
    }, []);

    const handleRemovePromocodeApplied = useCallback(() => {
      clearPromocodeInputRef.current?.();
      setPromocodeApplied(null);
    }, []);

    const registerClearPromocodeInput = useCallback((clearPromocodeInput) => {
      clearPromocodeInputRef.current = clearPromocodeInput;
    }, []);

    const selectedDiscountPercentage = selectedPaymentFrequency?.discountPercentage ?? 0;
    const selectedNumberMonths = selectedPaymentFrequency?.numberMonths ?? 1;
    const selectedPlanFee = selectedPlan?.fee ?? 0;
    const monthlyPrice = selectedPlanFee * (1 - selectedDiscountPercentage / 100);
    const periodTotal = monthlyPrice * selectedNumberMonths;
    const isTailoredPlan = isMoreThan100kSelected;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlan?.id;
    const canChoosePlan = selectedPlan && !isEqualPlan;
    const checkoutUrl = selectedPlan
      ? getCheckoutUrl({ search, selectedPlan, selectedPaymentFrequency, promocodeApplied })
      : '#';
    const selectedPeriodLabel = selectedPaymentFrequency
      ? _(`buy_process.discount_${selectedPaymentFrequency.subscriptionType.replace('-', '_')}`)
      : '';
    const badgeText = selectedDiscountPercentage
      ? `${selectedPeriodLabel} -${selectedDiscountPercentage}%`
      : selectedPeriodLabel;

    if (loading) {
      return <Loading page />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    if (plans.length === 0) {
      return (
        <NewPlanSelectionStyled>
          <div className="dp-container p-b-48">
            <div className="dp-new-plan-selection-header">
              <div className="dp-new-plan-selection-back">
                <GoBackButton />
              </div>
              <h2 className="dp-first-order-title dp-new-plan-selection-title">
                <FormattedMessage id="buy_process.new_plan_selection.title" />
                <span className="dpicon iconapp-email-alert" />
              </h2>
            </div>
            <div className="dp-wrap-message dp-wrap-info">
              <span className="dp-message-icon" />
              <div className="dp-content-message">
                <FormattedMessage id="buy_process.new_plan_selection.empty_message" />
              </div>
            </div>
          </div>
        </NewPlanSelectionStyled>
      );
    }

    return (
      <NewPlanSelectionStyled>
        <div className="dp-container p-b-48">
          <header className="dp-new-plan-selection-header">
            <div className="dp-new-plan-selection-back">
              <GoBackButton />
            </div>
            <h2 className="dp-first-order-title dp-new-plan-selection-title">
              <FormattedMessage id="buy_process.new_plan_selection.title" />
              <span className="dpicon iconapp-email-alert" />
            </h2>
            <p className="dp-new-plan-selection-subtitle">
              <FormattedMessage id="buy_process.new_plan_selection.subtitle" />
            </p>
          </header>

          <section className="dp-new-plan-selection-card">
            <div className="dp-new-plan-selection-card-header">
              <div>
                <h3 className="dp-second-order-title">
                  <FormattedMessage id="buy_process.new_plan_selection.contacts_plan_title" />
                </h3>
                <p>
                  <FormattedMessage id="buy_process.new_plan_selection.contacts_plan_description" />
                </p>
              </div>
              <span className="dp-new-plan-selection-badge">{badgeText}</span>
            </div>

            <div className="dp-rowflex dp-new-plan-selection-main">
              <div className="col-lg-8 col-md-12">
                <div className="dp-new-plan-selection-fields">
                  <div className="dp-new-plan-selection-select-wrap">
                    <label htmlFor="new-plan-selection-contacts" className="labelcontrol">
                      <FormattedMessage id="buy_process.new_plan_selection.contacts_label" />
                    </label>
                    <span className="dropdown-arrow" />
                    <select
                      id="new-plan-selection-contacts"
                      className="dp-new-plan-selection-select"
                      value={
                        isMoreThan100kSelected ? MORE_THAN_100K_OPTION_VALUE : selectedPlanIndex
                      }
                      onChange={handlePlanChange}
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

              <aside className="col-lg-4 col-md-12 dp-new-plan-selection-price" aria-live="polite">
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
                      value={monthlyPrice}
                      {...getFormattedPriceOptions(monthlyPrice)}
                    />
                    <span className="dp-new-plan-selection-price-period">
                      /<FormattedMessage id="buy_process.new_plan_selection.month_period" />*
                    </span>
                  </div>
                )}

                {!isTailoredPlan && selectedDiscountPercentage > 0 && (
                  <div className="dp-new-plan-selection-price-detail">
                    <span className="dp-new-plan-selection-old-price">
                      US$
                      <FormattedNumber
                        value={selectedPlanFee}
                        {...getFormattedPriceOptions(selectedPlanFee)}
                      />
                      /<FormattedMessage id="buy_process.new_plan_selection.month_period" />
                    </span>
                    <span className="dp-new-plan-selection-savings">
                      <FormattedMessage
                        id="buy_process.new_plan_selection.savings_text"
                        values={{
                          percentage: selectedDiscountPercentage,
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
                  </div>
                )}

                {isTailoredPlan ? (
                  <Link
                    className="dp-button button-medium primary-green"
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
                  <span>
                    <FormattedMessage id="buy_process.shopping_cart.renewal_description" />
                  </span>
                </p>
              </aside>
            </div>
          </section>
        </div>
      </NewPlanSelectionStyled>
    );
  },
);
