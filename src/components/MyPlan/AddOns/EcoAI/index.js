import { FormattedNumber, useIntl } from 'react-intl';
import { Card } from '../Card';
import { InjectAppServices } from '../../../../services/pure-di';
import * as S from '../Card/index.styles';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const PriceSection = ({ isBeta }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const price = 49;

  return (
    <>
      <div className="col-sm-6">
        {/* <div> */}
        <span className="dp-legend-price">{_(`my_plan.addons.eco_ai.access_by_legend`)}</span>
        {isBeta ? (
          <>
            <h2>
              US$ <FormattedNumber value={0} {...numberFormatOptions} />
              <span className="dp-disclaimer">{_(`my_plan.addons.eco_ai.month_legend`)}</span>
            </h2>
            <span className="dp-legend-price">{_(`my_plan.addons.regular_price_label`)}</span>{' '}
            <span className="dp-line-through">
              US$ <FormattedNumber value={price} {...numberFormatOptions} />
            </span>
            <S.PromotionAddOnFree>
              {_(`my_plan.addons.advantage_free_trial_label`)}
            </S.PromotionAddOnFree>
          </>
        ) : (
          <>
            <h2>
              US$ <FormattedNumber value={price} {...numberFormatOptions} />*
            </h2>
            <span className="dp-disclaimer">{_(`my_plan.addons.eco_ai.month_legend`)}</span>
          </>
        )}
      </div>
      {/* </div> */}
    </>
  );
};

export const EcoAI = InjectAppServices(({ ecoIA }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  var hasEcoIA = ecoIA?.plan?.active && ecoIA.plan?.fee > 0;

  return (
    <Card
      title={_(`my_plan.addons.eco_ai.title`)}
      icon={'icon-sparkle-ia'}
      description={_(`my_plan.addons.eco_ai.description`)}
      priceSection={<PriceSection isBeta={true}></PriceSection>}
      moreInformationText={_(`my_plan.addons.more_information_link`)}
      moreInformationLink={''}
      buyButtonText={_(
        `${
          hasEcoIA
            ? 'my_plan.addons.change_plan_button'
            : ecoIA?.active
              ? 'my_plan.addons.buy_button'
              : 'my_plan.addons.activate_now_button'
        }`,
      )}
      buyButtonUrl={'/buy-ecoia-plan?buyType=6'}
      isNewFeature={true}
      isBeta={true}
    ></Card>
  );
});
