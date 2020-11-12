import React, { useState, useReducer, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon, CardFeatures } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { Link } from 'react-router-dom';
import Collapse from '@kunukn/react-collapse';

const BulletOptions = ({ type }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <FormattedMessage
      id={'change_plan.features_HTML_' + type}
      values={{
        option: (chunks) => (
          <OptionItem
            key={type + '-option' + chunks.toString().substring(1, 20)}
            bullet={<BasicBullet />}
          >
            {chunks}
          </OptionItem>
        ),
        star: (chunks) => (
          <OptionItem
            key={type + '-star' + chunks.toString().substring(1, 20)}
            bullet={<StarBullet />}
          >
            {chunks}
          </OptionItem>
        ),
        newOption: (chunks) => (
          <OptionItem
            key={type + '-newoption' + chunks.toString().substring(1, 20)}
            bullet={<BasicBullet />}
          >
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
        newStar: (chunks) => (
          <OptionItem
            key={type + '-newstar' + chunks.toString().substring(1, 20)}
            bullet={<StarBullet />}
          >
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
        bigData: (chunks) => (
          <OptionItem
            key={type + '-bd' + chunks.toString().substring(1, 20)}
            bullet={<BigDataBullet>{_('change_plan.big_data_tooltip')}</BigDataBullet>}
          >
            {chunks}
          </OptionItem>
        ),
        newBigData: (chunks) => (
          <OptionItem
            key={type + '-newbd' + chunks.toString().substring(1, 20)}
            bullet={<BigDataBullet>{_('change_plan.big_data_tooltip')}</BigDataBullet>}
          >
            {chunks} <NewLabel>{_('change_plan.new_label')}</NewLabel>
          </OptionItem>
        ),
      }}
    >
      {(txt) => (
        <ul key={type + '-features'} className="dp-list-detail">
          {txt}
        </ul>
      )}
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
      <Collapse isOpen={showFeatures}>
        <CardFeatures>
          <BulletOptions type={'free'} />
        </CardFeatures>
      </Collapse>
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
        src={_('common.ui_library_image', { imageUrl: 'icono-agencias.svg' })}
      ></img>
      <CardAction url="/email-marketing-for-agencies">{_('change_plan.ask_demo')}</CardAction>
      <Collapse isOpen={showFeatures}>
        <CardFeatures>
          <BulletOptions type={'agencies'} />
        </CardFeatures>
      </Collapse>
    </Card>
  );
};

const CardWithPrice = ({ path, showFeatures, currentPlanType, promoCode }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <Card highlighted={path.type === 'plus'}>
      {path.type === 'plus' ? <Ribbon content={_('change_plan.recommended')} /> : ''}
      <div className="dp-content-plans">
        <h3>{_(`change_plan.card_${path.type}_title`)}</h3>
        <p>{_(`change_plan.card_${path.type}_description`)}</p>
      </div>

      <CardPrice doNotShowSince={path.current} currency="US$">
        {path.minimumFee}
      </CardPrice>
      {path.current && !path.deadEnd ? (
        <>
          <Link
            to={`/plan-selection/${path.type}/${currentPlanType}?${
              promoCode ? 'promo-code=' + promoCode : ''
            }`}
            className="dp-button button-medium secondary-green"
          >
            {_(`change_plan.increase_action_${currentPlanType.replace('-', '_')}`)}
          </Link>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : path.current && path.deadEnd ? (
        <>
          <span class="dp-maximum">{_('change_plan.card_generic_maximum_reached')}</span>
          <span className="dp-what-plan">{_('change_plan.current_plan')}</span>
        </>
      ) : (
        // TODO: add action related to path only
        <CardAction
          url={`/plan-selection/${path.type}?${promoCode ? 'promo-code=' + promoCode : ''}`}
        >
          {_('change_plan.calculate_price')}
        </CardAction>
      )}
      <Collapse isOpen={showFeatures}>
        <CardFeatures>
          {!path.current ? <h4>{_(`change_plan.features_title_${path.type}`)}</h4> : ''}
          <BulletOptions type={path.type} />
        </CardFeatures>
      </Collapse>
    </Card>
  );
};

const ChangePlan = ({ location, dependencies: { planService, appSessionRef } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
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
    const fetchData = async () => {
      setState({ loading: true });
      const planList = await planService.getPlanList();
      const sessionPlan = appSessionRef.current.userData.user.plan;
      const currentPlan = planService.mapCurrentPlanFromTypeOrId(
        sessionPlan.planType,
        sessionPlan.idPlan,
        planList,
      );
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
      {state.loading ? (
        <Loading page />
      ) : (
        <div className="dp-gray-page p-t-54 p-b-54">
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="dp-align-center">
                <h1 className="dp-tit-plans">{_('change_plan.title')}</h1>
              </div>{' '}
            </div>{' '}
          </section>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="dp-align-center p-t-30">
                {state.pathList?.length ? (
                  state.pathList.map((path, index) =>
                    path.type === 'free' ? (
                      <FreeCard key={index} showFeatures={isFeaturesVisible}></FreeCard>
                    ) : path.type === 'agencies' ? (
                      <AgenciesCard key={index} showFeatures={isFeaturesVisible}></AgenciesCard>
                    ) : (
                      <CardWithPrice
                        key={index}
                        path={path}
                        showFeatures={isFeaturesVisible}
                        currentPlanType={state.currentPlan.type}
                        promoCode={promoCode}
                      ></CardWithPrice>
                    ),
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-sm-12">
              <button
                className={`dp-compare-details-plans ${isFeaturesVisible ? 'dp-open-compare' : ''}`}
                onClick={() => toggleFeatures()}
              >
                {_('change_plan.compare_features')}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default InjectAppServices(ChangePlan);
