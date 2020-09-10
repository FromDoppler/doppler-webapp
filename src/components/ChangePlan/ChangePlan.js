import React, { useState, useEffect } from 'react';
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

const ChangePlan = ({ location, dependencies: { planService, appSessionRef } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [state, setState] = useState({
    loading: true,
    isFeaturesVisible: false,
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
          isFeaturesVisible: false,
          currentPlan: currentPlan,
        });
      }
    };
    fetchData();
  }, [planService, appSessionRef]);

  const getFeatureTitleByType = (type) => {
    switch (type) {
      case 'standard':
        return _('change_plan.features_title_standard');
      case 'plus':
        return _('change_plan.features_title_plus');
      default:
        return '';
    }
  };

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
                state.pathList.map((path, index) => (
                  <Card highlighted={path.type === 'plus'} key={index}>
                    {path.type === 'plus' ? (
                      <Ribbon content={_('change_plan.recommended')} />
                    ) : null}

                    <div
                      className={
                        path.type === 'free' ? 'dp-content-plans-free' : 'dp-content-plans'
                      }
                    >
                      <h3>{path.type}</h3>
                      <p>{_('change_plan.description_' + path.type)}</p>
                    </div>
                    {path.type !== 'free' && path.type !== 'agencies' ? (
                      <CardPrice currency="US$">{path.minimumFee}</CardPrice>
                    ) : (
                      ''
                    )}
                    {path.type === 'agencies' ? (
                      <>
                        <img
                          alt="agency-icon"
                          className="dp-price"
                          style={{ width: '80px' }}
                          src={_('change_plan.agencies_icon')}
                        ></img>
                        <CardAction url={getPlanUrl('18', advancedPay, promoCode, _)}>
                          {_('change_plan.ask_demo')}
                        </CardAction>
                      </>
                    ) : path.current ? (
                      path.deadEnd ? (
                        <div className="dp-cta-plan">
                          <span className="dp-current-plan"> {_('change_plan.current_plan')} </span>
                        </div>
                      ) : (
                        <>
                          <button type="button" className="dp-button button-medium secondary-green">
                            {_(
                              'change_plan.increase_action_' +
                                state.currentPlan.type.replace('-', '_'),
                            )}
                          </button>
                          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
                        </>
                      )
                    ) : (
                      <CardAction url={getPlanUrl('18', advancedPay, promoCode, _)}>
                        {_('change_plan.calculate_price')}
                      </CardAction>
                    )}
                    {state.isFeaturesVisible ? (
                      <CardFeatures>
                        <h4>{getFeatureTitleByType(path.type)}</h4>
                        <BulletOptions type={path.type} />
                      </CardFeatures>
                    ) : null}
                  </Card>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="p-t-30 p-b-30">
            <button
              className="dp-compare-details-plans"
              onClick={() => {
                setState({ ...state, isFeaturesVisible: !state.isFeaturesVisible });
              }}
            >
              {_('change_plan.compare_features')}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default InjectAppServices(ChangePlan);
