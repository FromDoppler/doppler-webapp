import { FormattedMessage, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../../utils';

export const PromocodeMessages = ({
  allowPromocode,
  hasPromocodeAppliedItem,
  validated,
  promocodeApplied,
  promotion,
  selectedMarketingPlan,
  amountDetailsData,
  validationError,
  promocodeMessageAlreadyShowRef,
}) => {
  if (!allowPromocode) {
    return hasPromocodeAppliedItem ? <PromocodeNotAllowed /> : null;
  }

  if (!promotion) {
    return null;
  }

  if (promotion?.canApply === false && promotion?.promocode !== '') {
    return <PromocodeCanNotApplyMessage promotion={promotion}></PromocodeCanNotApplyMessage>;
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
