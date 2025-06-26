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

  const priceByEditor = 80;
  const priceByHtml = 200;

  return (
    <>
      <div className="col-sm-3">
        <span className="dp-legend-price">
          {_(`my_plan.addons.layout_service.editor_piece_from_legend`)}
        </span>
        <h2>
          US$ <FormattedNumber value={priceByEditor} {...numberFormatOptions} />*
        </h2>
        <span className="dp-disclaimer">
          {_(`my_plan.addons.layout_service.editor_piece_legend`)}
        </span>
      </div>
      <div className="col-sm-3">
        <span className="dp-legend-price">
          {_(`my_plan.addons.layout_service.html_piece_from_legend`)}
        </span>
        <h2>
          US$ <FormattedNumber value={priceByHtml} {...numberFormatOptions} />
        </h2>
        <span className="dp-disclaimer">
          {_(`my_plan.addons.layout_service.html_piece_legend`)}
        </span>
      </div>
    </>
  );
};

export const LayoutService = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <Card
      title={_(`my_plan.addons.layout_service.title`)}
      icon={'iconapp-source-file'}
      description={_(`my_plan.addons.layout_service.description`)}
      priceSection={<PriceSection></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={'#'}
      buyButtonText={_(`my_plan.addons.request_quote_button`)}
      buyButtonUrl={'/additional-services'}
    ></Card>
  );
};
