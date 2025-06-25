import { FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';
import { InjectAppServices } from '../../../../services/pure-di';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const loadFrom = 50;

  return (
    <>
      <div className="col-sm-3">
        <div className="m-l-18">
          <span className="dp-legend-price">
            {_(`my_plan.addons.sms.load_from_legend`)}
          </span>
          <h2>
            US$ <FormattedNumber value={loadFrom} {...numberFormatOptions} />*
          </h2>
          <span className="dp-disclaimer">
            {_(`my_plan.addons.sms.minimum_load_legend`)}
          </span>
        </div>
      </div>
      <div className="col-sm-3"></div>
    </>
  );
};

export const Sms = InjectAppServices(({ dependencies: { appSessionRef } }) => {
   const { sms } = appSessionRef.current.userData.user;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.sms.title`)}
      icon={'iconapp-checklist'}
      description={_(`my_plan.addons.sms.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'https://www.fromdoppler.com/es/campanas-sms/?utm_source=direct'}
      buyButtonText={_(`my_plan.addons.buy_button`)}
      buyButtonUrl={sms.buttonUrl}
    ></Card>
  );
});
