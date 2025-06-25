import { FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const priceMonthly = 5;
  const price = 150;

  return (
    <>
      <div className="col-sm-3">
        <span className="dp-legend-price">
          {_(`my_plan.addons.custom_reports.monthly_report_legend`)}
        </span>
        <h2>
          US$ <FormattedNumber value={priceMonthly} {...numberFormatOptions} />*
        </h2>
        <span className="dp-disclaimer">{_(`my_plan.addons.custom_reports.monthly_legend`)}</span>
      </div>
      <div className="col-sm-3">
        <span className="dp-legend-price">
          {_(`my_plan.addons.custom_reports.one_time_report_legend`)}
        </span>
        <h2>
          US$ <FormattedNumber value={price} {...numberFormatOptions} />
        </h2>
        <span className="dp-disclaimer"></span>
      </div>
    </>
  );
};

export const CustomReports = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.custom_reports.title`)}
      icon={'iconapp-growth-chart'}
      description={_(`my_plan.addons.custom_reports.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={
        'https://www.fromdoppler.com/es/metricas-email-marketing/?utm_source=direct'
      }
      buyButtonText={_(`my_plan.addons.request_quote_button`)}
      buyButtonUrl={'/additional-services'}
    ></Card>
  );
};
