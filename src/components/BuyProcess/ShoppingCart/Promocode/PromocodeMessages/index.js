import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../../doppler-types';
import { getPlanFee, thousandSeparatorNumber } from '../../../../../utils';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const PromocodeMessages = ({
  allowPromocode,
  validated,
  promocodeApplied,
  promotion,
  selectedMarketingPlan,
  amountDetailsData,
  validationError,
  promocodeMessageAlreadyShowRef,
}) => {
  if (!allowPromocode) {
    return <PromocodeNotAllowed />;
  }

  if (!promotion) {
    return null;
  }

  if (promotion?.canApply === false) {
    return <PromocodeCanNotApplyMessage promotion={promotion}></PromocodeCanNotApplyMessage>;
  }

  const marketingPlanHasBillingCicle = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail].includes(
    promotion?.planType,
  );

  if (
    !validationError &&
    validated &&
    !promocodeMessageAlreadyShowRef.current &&
    (promotion?.planType === PLAN_TYPE.byCredit ||
      (promotion?.planType !== PLAN_TYPE.byCredit && amountDetailsData?.value?.nextMonthTotal))
  ) {
    return (
      <div className={`dp-simulated-price ${!promocodeApplied ? 'bounceIn' : 'bounceOut'}`}>
        {marketingPlanHasBillingCicle ? (
          <PromocodeMessageWithBillingCicle
            selectedMarketingPlan={selectedMarketingPlan}
            amountDetailsData={amountDetailsData}
            promotion={promotion.promotionApplied}
          />
        ) : (
          <PromocodeMessageExtraCredits promotion={promotion?.promotionApplied} />
        )}
      </div>
    );
  }

  return null;
};

const PromocodeNotAllowed = () => (
  <div className="dp-wrap-message dp-wrap-warning">
    <span className="dp-message-icon" />
    <div className="dp-content-message">
      <p>El uso de código de descuento es valido solamente con el pago mensual.</p>
    </div>
  </div>
);

const PromocodeMessageExtraCredits = ({ promotion }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        US$X
        <FormattedNumber value={0} {...numberFormatOptions} />
      </span>
      <h3>
        {_('buy_process.promocode.extra_credits_label')}{' '}
        {thousandSeparatorNumber(intl.defaultLocale, promotion?.extraCredits)}
      </h3>
      <span>{_('buy_process.promocode.valid_until_label')}</span>
    </>
  );
};

const PromocodeMessageWithBillingCicle = ({
  selectedMarketingPlan,
  amountDetailsData,
  promotion,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span className="dp-strike">
        US$X
        <FormattedNumber value={getPlanFee(selectedMarketingPlan)} {...numberFormatOptions} />
        */{_('buy_process.promocode.label_month')}
      </span>
      <h3>
        US$X
        <FormattedNumber
          value={amountDetailsData?.value?.nextMonthTotal}
          {...numberFormatOptions}
        />
        /{_('buy_process.promocode.label_month')}
      </h3>
      {promotion?.duration && (
        <span>
          <FormattedMessage
            id={'buy_process.promocode.is_valid_to'}
            values={{
              months: promotion?.duration,
            }}
          />
        </span>
      )}
    </>
  );
};

const PromocodeCanNotApplyMessage = ({ promotion }) => {
  const intl = useIntl();
  const planPromotions = promotion.planPromotions ?? [];
  const lang = intl.locale;

  const showQuantityInformation = (quantity) => {
    var quantites = quantity !== null ? quantity.split(',') : [];
    var result = '';

    const length = quantites.length;
    quantites.forEach((item, index) => {
      var value = thousandSeparatorNumber(intl.defaultLocale, item);
      var separator =
        index === 0 ? '' : index + 1 < length ? ', ' : lang === 'es' ? ' y ' : ' and ';
      result = result + separator + value;
    });

    return result;
  };

  return (
    <div className="dp-wrap-message dp-wrap-info">
      <span className="dp-message-icon" />
      <div className="dp-content-message">
        <p>
          <FormattedMessage
            id={`${'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_message'}`}
            values={{
              bold: (chunk) => <b>{chunk}</b>,
              br: <br />,
            }}
          />
        </p>
        {planPromotions.map((item, index) => (
          <p key={index}>
            <FormattedMessage
              id={`${
                item.quantity === null || parseInt(item.quantity) === 0
                  ? 'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_all_plan_item_message'
                  : 'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_plan_item_message'
              }`}
              values={{
                bold: (chunk) => <b>{chunk}</b>,
                br: <br />,
                planType: item.planType,
                quantity: showQuantityInformation(item.quantity),
              }}
            />
          </p>
        ))}
      </div>
    </div>
  );
};
