import { FormattedNumber, useIntl } from 'react-intl';
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

  const marketingPlanHasBillingCicle = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail].includes(
    promotion?.planType,
  );

  if (
    !validationError &&
    validated &&
    !promocodeMessageAlreadyShowRef.current &&
    amountDetailsData?.value?.nextMonthTotal
  ) {
    return (
      <div className={`dp-simulated-price ${!promocodeApplied ? 'bounceIn' : 'bounceOut'}`}>
        {marketingPlanHasBillingCicle ? (
          <PromocodeMessageWithBillingCicle
            selectedMarketingPlan={selectedMarketingPlan}
            amountDetailsData={amountDetailsData}
            promotion={promotion}
          />
        ) : (
          <PromocodeMessageExtraCredits promotion={promotion} />
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

  return (
    <>
      <span>
        US$X
        <FormattedNumber value={0} {...numberFormatOptions} />
      </span>
      <h3>
        Créditos Extras: {thousandSeparatorNumber(intl.defaultLocale, promotion?.extraCredits)}
      </h3>
      <span>Vigentes hasta agotarse la existencia</span>
    </>
  );
};

const PromocodeMessageWithBillingCicle = ({
  selectedMarketingPlan,
  amountDetailsData,
  promotion,
}) => {
  return (
    <>
      <span className="dp-strike">
        US$X
        <FormattedNumber value={getPlanFee(selectedMarketingPlan)} {...numberFormatOptions} />
        */mes
      </span>
      <h3>
        US$X
        <FormattedNumber
          value={amountDetailsData?.value?.nextMonthTotal}
          {...numberFormatOptions}
        />
        */mes
      </h3>
      <span>Durante {promotion?.duration} meses</span>
    </>
  );
};
