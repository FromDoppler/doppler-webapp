import React, { useState, useReducer, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon, CardFeatures } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { InjectAppServices } from '../../services/pure-di';

function getPlanUrl(planId, advancedPay, promoCode, _) {
  return (
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True&IdDiscountPlan=${advancedPay}&PromoCode=${promoCode}`
  );
}
const BulletOptions = ({ type }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <FormattedMessage
      id={'change_plan.features_HTML_' + type}
      values={{
        option: (chunks) => <OptionItem bullet={<BasicBullet />}>{chunks}</OptionItem>,
        star: (chunks) => <OptionItem bullet={<StarBullet />}>{chunks}</OptionItem>,
        newOption: (chunks) => (
          <OptionItem bullet={<BasicBullet />}>
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
        newStar: (chunks) => (
          <OptionItem bullet={<StarBullet />}>
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
        bigData: (chunks) => (
          <OptionItem bullet={<BigDataBullet>{_('change_plan.big_data_tooltip')}</BigDataBullet>}>
            {chunks}
          </OptionItem>
        ),
        newBigData: (chunks) => (
          <OptionItem bullet={<BigDataBullet>{_('change_plan.big_data_tooltip')}</BigDataBullet>}>
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
      }}
    >
      {(txt) => <ul className="dp-list-detail">{txt}</ul>}
    </FormattedMessage>
  );
};

const StarBullet = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <span className="dp-icostar">
      <img alt="star icon" src={_('common.ui_library_image', { imageUrl: 'ico-star.svg' })} />
    </span>
  );
};

const OptionItem = ({ children, bullet }) => {
  return (
    <li>
      {bullet}
      <span>{children}</span>
    </li>
  );
};

const BasicBullet = () => {
  return <span className="dp-icodot">.</span>;
};

const NewLabel = ({ children }) => {
  return <span className="dp-new">{children}</span>;
};

const BigDataBullet = ({ children }) => {
  return (
    <div className="dp-tooltip-container">
      <span className="dp-icobd">BD</span>
      <div className="dp-tooltip-block">
        <span className="tooltiptext">{children}</span>
      </div>
    </div>
  );
};

const FreeCard = ({ showFeatures }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <Card>
      <div className="dp-content-plans-free">
        <h3>{_('change_plan.card_free_title')}</h3>
        <p>{_('change_plan.card_free_description')}</p>
      </div>
      <div className="dp-cta-plan">
        <span className="dp-current-plan"> {_('change_plan.current_plan')} </span>
      </div>
      {showFeatures ? (
        <CardFeatures>
          <BulletOptions type={'free'} />
        </CardFeatures>
      ) : null}
    </Card>
  );
};

const AgenciesCard = ({ showFeatures }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <Card>
      <div className="dp-content-plans">
        <h3>{_('change_plan.card_agencies_title')}</h3>
        <p>{_('change_plan.card_agencies_description')}</p>
      </div>
      <img
        alt="agency-icon"
        className="dp-price"
        style={{ width: '80px' }}
        src={_('change_plan.agencies_icon')}
      ></img>
      <CardAction url={getPlanUrl('18', 0, 'promo', _)}>{_('change_plan.ask_demo')}</CardAction>
      {showFeatures ? (
        <CardFeatures>
          <BulletOptions type={'agencies'} />
        </CardFeatures>
      ) : null}
    </Card>
  );
};

const StandardCard = ({ path, showFeatures, currentPlanType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <Card>
      <div className="dp-content-plans">
        <h3>{_('change_plan.card_standard_title')}</h3>
        <p>{_('change_plan.card_standard_description')}</p>
      </div>

      <CardPrice currency="US$">{path.minimumFee}</CardPrice>

      {path.current && !path.deadEnd ? (
        <>
          <button type="button" className="dp-button button-medium secondary-green">
            {_('change_plan.increase_action_' + currentPlanType.replace('-', '_'))}
          </button>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : path.current && path.deadEnd ? (
        <>
          <span class="dp-maximum">{_('change_plan.card_generic_maximum_reached')}</span>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : (
        <CardAction url={getPlanUrl('18', 0, 'promo', _)}>{_('change_plan.ask_demo')}</CardAction>
      )}

      {showFeatures ? (
        <CardFeatures>
          <h4>{_('change_plan.features_title_standard')}</h4>
          <BulletOptions type={'standard'} />
        </CardFeatures>
      ) : null}
    </Card>
  );
};

const PlusCard = ({ path, showFeatures, currentPlanType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <Card highlighted>
      <Ribbon content={_('change_plan.recommended')} />

      <div className="dp-content-plans">
        <h3>{_('change_plan.card_plus_title')}</h3>
        <p>{_('change_plan.card_plus_description')}</p>
      </div>

      <CardPrice currency="US$">{path.minimumFee}</CardPrice>

      {path.current && !path.deadEnd ? (
        <>
          <button type="button" className="dp-button button-medium secondary-green">
            {_('change_plan.increase_action_' + currentPlanType.replace('-', '_'))}
          </button>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : path.current && path.deadEnd ? (
        <>
          <span class="dp-maximum">{_('change_plan.card_generic_maximum_reached')}</span>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : (
        <CardAction url={getPlanUrl('18', 0, 'promo', _)}>{_('change_plan.ask_demo')}</CardAction>
      )}

      {showFeatures ? (
        <CardFeatures>
          <h4>{_('change_plan.features_title_plus')}</h4>
          <BulletOptions type={'plus'} />
        </CardFeatures>
      ) : null}
    </Card>
  );
};

const ChangePlan = ({ location, dependencies: { planService, appSessionRef } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const reducer = (isFeaturesVisible) => {
    return !isFeaturesVisible;
  };
  const [isFeaturesVisible, toggleFeatures] = useReducer(reducer, false);

  const [state, setState] = useState({
    loading: true,
  });
  useEffect(() => {
    const mapCurrentPlan = (sessionPlan, planList) => {
      const exclusivePlan = { type: 'exclusive' };
      switch (sessionPlan.planType) {
        case 'subscribers':
        case 'monthly-deliveries':
          // for subscribers and monthly plan will be exclusive until id plan is deployed in doppler
          const monthlyPlan = planService.getPlanBySessionPlanId(sessionPlan.idPlan, planList);
          return monthlyPlan ? monthlyPlan : exclusivePlan;
        case 'prepaid':
          return planService.getCheapestPrepaidPlan(planList);
        case 'agencies':
          return {
            type: 'agency',
            featureSet: 'agency',
          };
        default:
          return {
            type: 'free',
            subscriberLimit: 500,
            featureSet: 'free',
          };
      }
    };
    const fetchData = async () => {
      setState({ loading: true });
      const planList = await planService.getPlanList();
      const currentPlan = mapCurrentPlan(appSessionRef.current.userData.user.plan, planList);
      const pathList = await planService.getPaths(currentPlan, planList);
      if (pathList.length) {
        setState({
          loading: false,
          pathList: pathList,
          currentPlan: currentPlan,
        });
      }
    };
    fetchData();
  }, [planService, appSessionRef]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Compra un plan</title>
      </Helmet>
      <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center">
              <h1>{_('change_plan.title')}</h1>
            </div>{' '}
          </div>{' '}
        </section>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center p-t-30 p-b-30">
              {state.pathList?.length ? (
                state.pathList.map((path, index) =>
                  path.type === 'free' ? (
                    <FreeCard key={index} showFeatures={isFeaturesVisible}></FreeCard>
                  ) : path.type === 'agencies' ? (
                    <AgenciesCard key={index} showFeatures={isFeaturesVisible}></AgenciesCard>
                  ) : path.type === 'standard' ? (
                    <StandardCard
                      key={index}
                      path={path}
                      showFeatures={isFeaturesVisible}
                      currentPlanType={state.currentPlan.type}
                    ></StandardCard>
                  ) : (
                    <PlusCard
                      key={index}
                      path={path}
                      showFeatures={isFeaturesVisible}
                      currentPlanType={state.currentPlan.type}
                    ></PlusCard>
                  ),
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="p-t-30 p-b-30">
            <button className="dp-compare-details-plans" onClick={() => toggleFeatures()}>
              {_('change_plan.compare_features')}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default InjectAppServices(ChangePlan);
