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

const mapCurrentPlan = (plan) => {
  switch(plan.planType){
    case 'demo':
    case 'free':
      return {
        type: 'free',
        subscriberLimit: 500,
        featureSet: 'free',
      };
    case 'monthly-deliveries': 
    return {
      type: 'monthly-deliveries',
      id: 0,
      name: plan.planName,
      emailsByMonth: plan?.maxSubscribers,
      extraEmailPrice: 0,
      fee: 0,
      featureSet: 'standard', // TODO: this must be get in BE 
      featureList: [],
      billingCycleDetails: [],
    };
    case 'subscribers':
      return {
        type: 'subscribers',
        id: 0,
        name: '',
        subscriberLimit: plan?.maxSubscribers,
        fee: 0,
        featureSet: 'standard', // TODO: this must be get in BE 
        featureList: [],
        billingCycleDetails: [],
      }
    case 'prepaid':
      return {
        type: 'prepaid',
        id: 0,
        name: '',
        credits: plan.remainingCredits,
        price: 0,
        featureSet: 'standard',
      }
    case 'agencies':
      return {
        type: 'agency',
        featureSet: 'agency', 
      }
  }
  
};

const ChangePlan = ({ location, dependencies: { planService, appSessionRef } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const currentPlan = mapCurrentPlan(appSessionRef.current.userData.user.plan);

  console.log(currentPlan);

  const [state, setState] = useState({
    loading: true,
    isFeaturesVisible: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const pathList = await planService.getPaths(currentPlan, await planService.getPlanList());
      console.log(JSON.stringify(pathList));
      if (pathList.length) {
        setState({
          loading: false,
          pathList: pathList,
          isFeaturesVisible: false,
        });
      }
    };
    fetchData();
  }, [planService]);

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

  const optionItem = (chunks, bullet, label) => {
    return (
      <li>
        {bullet}
        <span>
          {chunks} {label}
        </span>
      </li>
    );
  };

  const basicBullet = () => {
    return <span className="dp-icodot">.</span>;
  };

  const starBullet = () => {
    return (
      <span className="dp-icostar">
        <img alt="star icon" src={_('common.ui_library_image', { imageUrl: 'ico-star.svg' })} />
      </span>
    );
  };

  const newLabel = () => {
    return dopplerLabel(_('change_plan.new_label'));
  };

  const dopplerLabel = (text) => {
    return <span class="dp-new">{text}</span>;
  };

  const bigDataBullet = (tooltipText) => {
    return (
      <div class="dp-tooltip-container">
        <span class="dp-icobd">BD</span>
        <div class="dp-tooltip-block">
          <span class="tooltiptext">{tooltipText}</span>
        </div>
      </div>
    );
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
                    {path.current ? (path.deadEnd?
                      (<div className="dp-cta-plan">
                        <span className="dp-current-plan"> {_('change_plan.current_plan')} </span>
                      </div>
                      ): (
                        <>
                        <button type="button" class="dp-button button-medium secondary-green">
                          {_('change_plan.increase_action_'+ currentPlan.type.replace('-', '_'))}
                        </button>
                        <span class="dp-what-plan">{_('change_plan.current_plan')}</span>
                        </>
                      )
                    ) : path.type === 'agencies' ? (
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
                    ) : (
                      <CardAction url={getPlanUrl('18', advancedPay, promoCode, _)}>
                        {_('change_plan.calculate_price')}
                      </CardAction>
                    )}
                    {state.isFeaturesVisible ? (
                      <CardFeatures>
                        <h4>{getFeatureTitleByType(path.type)}</h4>
                        <FormattedMessage
                          id={'change_plan.features_HTML_' + path.type}
                          values={{
                            option: (chunks) => optionItem(chunks, basicBullet()),
                            star: (chunks) => optionItem(chunks, starBullet()),
                            newOption: (chunks) => optionItem(chunks, basicBullet(), newLabel()),
                            newStar: (chunks) => optionItem(chunks, starBullet(), newLabel()),
                            bigData: (chunks) => optionItem(chunks, bigDataBullet()),
                            newBigData: (chunks) =>
                              optionItem(
                                chunks,
                                bigDataBullet(_('change_plan.big_data_tooltip')),
                                newLabel(),
                              ),
                          }}
                        >
                          {(txt) => <ul className="dp-list-detail">{txt}</ul>}
                        </FormattedMessage>
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
