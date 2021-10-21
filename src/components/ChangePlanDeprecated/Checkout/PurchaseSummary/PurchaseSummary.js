import React, { useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
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
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}_label`)}
        <strong> {getQuantity()}</strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={plan?.fee} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const MonthsToPayInformation = ({ plan, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
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
    </>
  );
};

export const DiscountPrice = ({ discountPrepayment }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.discount_for_prepayment`)}{' '}
        <strong>- {discountPrepayment.discountPercentage}%</strong>
      </span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPrepayment.amount} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const DiscountPaymentPaid = ({ discountPaymentAlreadyPaid }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>{_(`checkoutProcessForm.purchase_summary.discount_for_payment_paid`)}</span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPaymentAlreadyPaid} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const StatusMessage = ({ type, message, show }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className={`dp-wrap-message dp-wrap-${type}`}>
        <span className="dp-message-icon" />
        <div className="dp-content-message">
          <p>{message}</p>
        </div>
      </div>
      <hr className="m-t-24 m-b-24"></hr>
    </>
  );
};

export const EditAddRecipients = ({ show }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!show) {
    return null;
  }

  return (
    <>
      <p>{_('checkoutProcessForm.purchase_summary.send_invoice_email_message')}</p>
      <button type="button" className="dp-link-recipients">
        {_('checkoutProcessForm.purchase_summary.edit_add_recipients_button')}
      </button>
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

export const InvoiceInformation = ({ priceToPay, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {priceToPay > 0 ? (
        <li>
          <h3 className="m-t-24">
            {`${_('checkoutProcessForm.purchase_summary.your_next_billing_legend')}`} {dollarSymbol}{' '}
            <FormattedNumber value={priceToPay - discount} {...numberFormatOptions} />
          </h3>
        </li>
      ) : (
        <li>
          <h3 className="m-t-24">{`${_(
            'checkoutProcessForm.purchase_summary.to_pay_from_next_month_legend',
          )}`}</h3>
        </li>
      )}
      <li>
        <span className="dp-renewal">{`*${_(
          'checkoutProcessForm.purchase_summary.explanatory_legend',
        )}`}</span>
      </li>
    </>
  );
};

export const TotalPurchase = ({ totalPlan, priceToPay, state }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { discountPrepayment } = state.amountDetails;

  return (
    <div className="dp-total-purchase">
      <ul>
        <li>
          <span>{_(`checkoutProcessForm.purchase_summary.total`)}</span>
          <span>
            {' '}
            <span className="dp-money">{dollarSymbol} </span>
            <FormattedNumber value={priceToPay} {...numberFormatOptions} />
          </span>
        </li>
        <InvoiceInformation priceToPay={totalPlan} discount={discountPrepayment.amount} />
      </ul>
    </div>
  );
};

export const ShoppingList = ({ state, planType }) => {
  const { plan, discount } = state;
  const { discountPrepayment, discountPaymentAlreadyPaid } = state.amountDetails;

  return (
    <ul className="dp-summary-list">
      <li aria-label="units">
        <PlanInformation plan={plan} planType={planType} />
      </li>
      <li aria-label="months to pay">
        <MonthsToPayInformation discount={discount} plan={plan} planType={planType} />
      </li>
      {discountPrepayment.discountPercentage > 0 && (
        <li aria-label="discount">
          <DiscountPrice discountPrepayment={discountPrepayment} plan={plan} />
        </li>
      )}
      {discountPaymentAlreadyPaid > 0 && (
        <li>
          <DiscountPaymentPaid discountPaymentAlreadyPaid={discountPaymentAlreadyPaid} />
        </li>
      )}
    </ul>
  );
};

export const PurchaseSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient },
    discountId,
    canBuy,
  }) => {
    const location = useLocation();
    const history = useHistory();
    const [state, setState] = useState({
      loading: true,
      planData: {},
      amountDetails: { total: 0, discountPrepayment: { discountPercentage: 0 } },
      plan: { fee: 0 },
      discount: { discountPercentage: 0, monthsAmmount: 1 },
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);
    const createTimeout = useTimeout();
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType } = useRouteMatch().params;
    const selectedDiscountId =
      discountId === 0
        ? extractParameter(location, queryString.parse, 'discountId') ?? 0
        : discountId;
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;

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
          ? discountsData.value.find((d) => d.id.toString() === selectedDiscountId)
          : undefined;

        const amountDetailsData = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(
          selectedPlan,
          selectedDiscountId,
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
    }, [
      dopplerAccountPlansApiClient,
      dopplerBillingUserApiClient,
      selectedDiscountId,
      selectedPlan,
    ]);

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
        discountId: state.discount?.id,
        total: 500,
      });

      setError(!result.success);
      setSaving(false);

      if (result.success) {
        setSaved(true);
        createTimeout(() => {
          setSaved(false);
          history.push('/checkout-summary');
        }, 3000);
      }
    };

    const { total } = state.amountDetails;

    return (
      <>
        {state.loading && <Loading />}
        <div className="dp-hiring-summary">
          <header className="dp-header-summary">
            <h6>{_('checkoutProcessForm.purchase_summary.header')}</h6>
          </header>
          <h3>{getPlanTypeTitle()}</h3>
          <ShoppingList state={state} planType={planType} />
          <hr className="dp-hr-grey" />
          <Promocode />
          <hr className="dp-hr-grey" />
          <TotalPurchase
            totalPlan={state.plan.fee * state.discount?.monthsAmmount}
            priceToPay={total}
            state={state}
          />
        </div>
        <div className="dp-zigzag" />
        <div className="dp-cta-pay">
          <button
            type="button"
            className={'dp-button button-big primary-green' + (saving ? ' button--loading' : '')}
            disabled={!canBuy || saving}
            onClick={proceedToBuy}
          >
            {_('checkoutProcessForm.purchase_summary.buy_button')}
          </button>
          <button type="button" className="dp-button button-big">
            <span className="ms-icon icon-lock dp-color-green" />
            {_('checkoutProcessForm.purchase_summary.secure_payment_message')}
          </button>
        </div>
        <StatusMessage
          show={saved || error}
          type={saved ? 'success' : 'cancel'}
          message={_(`checkoutProcessForm.purchase_summary.${saved ? 'success' : 'error'}_message`)}
        />
        <EditAddRecipients show={false} />
      </>
    );
  },
);
