import React, { useEffect, useState } from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { extractParameter } from '../../../../utils';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { paymentType } from '../PaymentMethod/PaymentMethod';
import useTimeout from '../../../../hooks/useTimeout';

const dollarSymbol = 'US$';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const PlanInformation = ({ plan, planType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getQuantity = () => {
    switch (planType) {
      case 'prepaid':
        return plan.emailQty;
      case 'subscribers':
        return plan.subscribersQty;
      case 'monthly-deliveries':
        return plan.emailQty;
      default:
        return 0;
    }
  };

  return (
    <li>
      <span>
        {_(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}_label`)}
        <strong> {getQuantity()}</strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={plan?.fee} {...numberFormatOptions} />
      </span>
    </li>
  );
};

export const MonthsToPayInformation = ({ plan, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <li>
      <span>
        {_(`checkoutProcessForm.purchase_summary.months_to_pay`)}{' '}
        <strong>
          <FormattedMessage
            id="checkoutProcessForm.purchase_summary.month_with_plural"
            values={{ monthsCount: discount?.monthsAmmount }}
          ></FormattedMessage>
        </strong>
      </span>
      <span>
        {dollarSymbol}{' '}
        <FormattedNumber value={plan.fee * discount?.monthsAmmount} {...numberFormatOptions} />
      </span>
    </li>
  );
};

export const DiscountPrice = ({ discountPrepayment }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {discountPrepayment.amount > 0 ? (
        <li>
          <span>
            {_(`checkoutProcessForm.purchase_summary.discount_for_prepayment`)}{' '}
            <strong>- {discountPrepayment.discountPercentage}%</strong>
          </span>
          <span>
            -{dollarSymbol}{' '}
            <FormattedNumber value={discountPrepayment.amount} {...numberFormatOptions} />
          </span>
        </li>
      ) : null}
    </>
  );
};

export const DiscountPaymentPaid = ({ discountPaymentAlreadyPaid }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {discountPaymentAlreadyPaid > 0 ? (
        <li>
          <span>{_(`checkoutProcessForm.purchase_summary.discount_for_payment_paid`)}</span>
          <span>
            -{dollarSymbol}{' '}
            <FormattedNumber value={discountPaymentAlreadyPaid} {...numberFormatOptions} />
          </span>
        </li>
      ) : null}
    </>
  );
};

export const PriceWithDiscount = ({ price, discountPrepayment, discountPaymentAlreadyPaid }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const priceWithDiscount = price - discountPrepayment.amount - discountPaymentAlreadyPaid;

  return (
    <li>
      <span>{_(`checkoutProcessForm.purchase_summary.total`)}</span>
      <span>
        {' '}
        <span className="dp-money">{dollarSymbol} </span>
        <FormattedNumber value={priceWithDiscount} {...numberFormatOptions} />
      </span>
    </li>
  );
};

export const SuccessfulPurchase = ({ show }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {show ? (
        <>
          <div className="dp-wrap-message dp-wrap-success">
            <span className="dp-message-icon"></span>
            <div className="dp-content-message">
              <p>{_('checkoutProcessForm.purchase_summary.success_message')}</p>
            </div>
          </div>
          <hr className="m-t-24 m-b-24"></hr>
        </>
      ) : null}
    </>
  );
};

export const FailedPurchase = ({ show }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {show ? (
        <>
          <div className="dp-wrap-message dp-wrap-cancel">
            <span className="dp-message-icon"></span>
            <div className="dp-content-message">
              <p>{_('checkoutProcessForm.purchase_summary.error_message')}</p>
            </div>
          </div>
          <hr className="m-t-24 m-b-24"></hr>
        </>
      ) : null}
    </>
  );
};

export const EditAddRecipients = ({ show }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {show ? (
        <>
          <p>{_('checkoutProcessForm.purchase_summary.send_invoice_email_message')}</p>
          <p>
            <strong></strong>
          </p>
          <button type="button" className="dp-link-recipients" style={{ color: '#33ad73' }}>
            {_('checkoutProcessForm.purchase_summary.edit_add_recipients_button')}
          </button>
        </>
      ) : null}
    </>
  );
};

export const Promocode = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <form className="dp-promocode">
      <fieldset>
        <legend>{_('checkoutProcessForm.purchase_summary.promocode_legend')}</legend>
        <label className="Promocode">
          {_('checkoutProcessForm.purchase_summary.promocode_label')}
        </label>
        <div className="dp-tooltip-container">
          <input
            disabled={true}
            type="text"
            name="Promocode"
            id="Promocode"
            placeholder={_('checkoutProcessForm.purchase_summary.promocode_placeholder')}
            className=""
          />
          <div className="dp-tooltip-top">
            <span>{_('checkoutProcessForm.purchase_summary.promocode_tooltip')}</span>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export const TotalPurchase = ({ price, discountPrepayment, discountPaymentAlreadyPaid }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-total-purchase">
      <ul>
        <PriceWithDiscount
          discountPrepayment={discountPrepayment}
          price={price}
          discountPaymentAlreadyPaid={discountPaymentAlreadyPaid}
        />
        <li>
          <span className="dp-renewal">{`*${_(
            'checkoutProcessForm.purchase_summary.explanatory_legend',
          )}`}</span>
        </li>
      </ul>
    </div>
  );
};

export const PurchaseSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient },
    discountId,
    canBuy,
  }) => {
    const location = useLocation();
    const [state, setState] = useState({ loading: true, planData: {} });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);
    const [redirectToUrl, setRedirectToUrl] = useState(false);
    const createTimeout = useTimeout();
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType } = useRouteMatch().params;
    const selectedDiscountId = extractParameter(location, queryString.parse, 'discountId') || 0;
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;

    if (discountId === 0) {
      discountId = selectedDiscountId;
    }

    useEffect(() => {
      const fetchData = async () => {
        const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
        const paymentMethod = paymentMethodData.success
          ? paymentMethodData.value.paymentMethodName
          : paymentType.creditCard;

        const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlan,
          paymentMethod,
        );

        const discount = discountsData.success
          ? discountsData.value.find((d) => d.id.toString() === discountId)
          : undefined;

        const amountDetailsData = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(
          selectedPlan,
          discountId,
          '',
        );

        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlan);

        setState({
          loading: false,
          plan: planData.value,
          discount,
          amountDetails: amountDetailsData.value,
        });
      };

      fetchData();
    }, [dopplerAccountPlansApiClient, dopplerBillingUserApiClient, discountId, selectedPlan]);

    const getPlanTypeTitle = () => {
      switch (planType) {
        case 'prepaid':
        case 'subscribers':
        case 'monthly-deliveries':
          return (
            _('checkoutProcessForm.purchase_summary.plan_standard_title') +
            ' - ' +
            _(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}`)
          );
        default:
          return '';
      }
    };

    const proceedToBuy = async () => {
      setSaving(true);
      const result = await dopplerBillingUserApiClient.purchase({
        planId: state.plan.id,
        discountId: state.discount.id,
        total: 500,
      });

      setError(!result.success);
      setSaving(false);

      if (result.success) {
        setSaved(true);
        createTimeout(() => {
          setSaved(false);
          setRedirectToUrl('/checkout-summary');
        }, 3000);
      }
    };

    return (
      <>
        {redirectToUrl ? (
          <Redirect to={redirectToUrl} />
        ) : state.loading ? (
          <Loading page />
        ) : (
          <>
            <div className="dp-hiring-summary">
              <header className="dp-header-summary">
                <h6>{_('checkoutProcessForm.purchase_summary.header')}</h6>
              </header>
              <h3>{getPlanTypeTitle()}</h3>
              <ul className="dp-summary-list">
                <PlanInformation plan={state.plan} planType={planType} />
                <MonthsToPayInformation
                  discount={state.discount}
                  plan={state.plan}
                  planType={planType}
                />
                <DiscountPrice
                  discountPrepayment={state.amountDetails.discountPrepayment}
                  plan={state.plan}
                />
                <DiscountPaymentPaid
                  discountPaymentAlreadyPaid={state.amountDetails.discountPaymentAlreadyPaid}
                />
              </ul>
              <hr className="dp-hr-grey"></hr>
              <Promocode />
              <hr className="dp-hr-grey"></hr>
              <TotalPurchase
                discountPrepayment={state.amountDetails?.discountPrepayment}
                price={state.plan.fee * state.discount?.monthsAmmount}
                discountPaymentAlreadyPaid={state.amountDetails.discountPaymentAlreadyPaid}
              />
            </div>
            <div>
              <div className="dp-zigzag"></div>
            </div>
            <div className="dp-cta-pay">
              <button
                type="button"
                className={
                  'dp-button button-big primary-green' + ((saving && ' button--loading') || '')
                }
                disabled={!canBuy || saving}
                onClick={() => proceedToBuy()}
              >
                {_('checkoutProcessForm.purchase_summary.buy_button')}
              </button>
              <button type="button" className="dp-button button-big">
                <span className="ms-icon icon-lock dp-color-green"></span>
                {_('checkoutProcessForm.purchase_summary.secure_payment_message')}
              </button>
            </div>
            <SuccessfulPurchase show={saved} />
            <FailedPurchase show={error} />
            <EditAddRecipients show={false} />
          </>
        )}
      </>
    );
  },
);
