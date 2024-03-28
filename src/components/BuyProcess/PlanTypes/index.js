import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { PlanTypeCard } from './PlanTypeCard';
import { InjectAppServices } from '../../../services/pure-di';
import { useFetchPlanTypes } from '../../../hooks/useFetchPlanTypes';
import { Loading } from '../../Loading/Loading';
import { UnexpectedError } from '../../shared/UnexpectedError';
import { Element as ScrollElement } from 'react-scroll';
import { getQueryParamsWithAccountType } from '../../../utils';
import { FeaturesPlanTypes } from './FeaturesPlanTypes';
import { useGetMinPriceContactArgentina } from './useGetMinPriceContactArgentina';

const planByContactsUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`;
const planByEmailsUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}`;
const planByCreditsUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byCredit]}`;

const HeaderText = ({ title, description, comment, Container = 'div', containerProps }) => (
  <Container className="dp-align-center dp-header-text" {...containerProps}>
    <h1 className="dp-tit-center--big">{title}</h1>
    <p className="dp-p-w-50">{description}</p>
    <p className="dp-p-w-50">
      <strong>{comment}</strong>
    </p>
  </Container>
);

const mapPlanTypes = (planTypes, minPriceByContact, isArgentina = true) => {
  const currentMonthTotal = minPriceByContact?.amountDetailsData?.currentMonthTotal;
  const argentinaExclusiveDiscount = isArgentina && currentMonthTotal;

  const mappedPlanTypes = allPlanTypes.map((fullPlanType) => {
    if (fullPlanType.planType !== PLAN_TYPE.free) {
      const _planType = planTypes.find((pt) => pt.type === fullPlanType.planType);
      if (_planType) {
        let _fullPlanType = {
          ...fullPlanType,
          minPrice: _planType.minPrice,
        };
        if (argentinaExclusiveDiscount && fullPlanType.planType === PLAN_TYPE.byContact) {
          _fullPlanType = {
            ..._fullPlanType,
            minPriceWithDiscount: currentMonthTotal,
            discountPercentage: minPriceByContact.promotion.discountPercentage,
            isArgentina,
          };
        }
        return _fullPlanType;
      }
      return null;
    } else {
      return fullPlanType;
    }
  });

  return mappedPlanTypes;
};

const getMappedRows = ({ key, quantityFeatures }) => {
  const mappedRows = [];
  for (let index = 0; index < quantityFeatures; index++) {
    mappedRows.push({
      name: <FormattedMessage id={`plan_types.table.${key}.name_${index + 1}`} />,
      description: <FormattedMessage id={`plan_types.table.${key}.description_${index + 1}`} />,
    });
  }
  return mappedRows;
};

const TableRow = ({ row }) => (
  <tr>
    <td>
      <div className="dp-icon-lock">
        <span className="dp-ico--ok" />
        <span>{row.name}</span>
      </div>
    </td>
    <td>
      <span>{row.description}</span>
    </td>
  </tr>
);

export const PlanTypes = InjectAppServices(
  ({ dependencies: { planService, dopplerAccountPlansApiClient, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { locationCountry } = appSessionRef.current.userData.user;
    const isArgentina = locationCountry === 'ar';
    const { planTypes, loading, hasError } = useFetchPlanTypes(planService);
    const minPriceByContact = useGetMinPriceContactArgentina(
      planService,
      dopplerAccountPlansApiClient,
      planTypes,
      isArgentina,
    );
    const { search } = useLocation();
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;
    const queryParams = getQueryParamsWithAccountType({ search, isFreeAccount });

    if (!isFreeAccount) {
      return (
        <Navigate
          to={`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}?${queryParams}`}
        />
      );
    }

    if (loading) {
      return <Loading page />;
    }

    if (hasError) {
      return (
        <div className="m-t-36 m-b-36">
          <UnexpectedError msgId="common.something_wrong" />
        </div>
      );
    }

    const mappedPlanTypes = mapPlanTypes(planTypes, minPriceByContact, isArgentina);

    return (
      <div className="dp-app-container">
        <Helmet>
          <title>{_('plan_types.meta_title')}</title>
        </Helmet>

        <section className="p-t-30 p-b-30">
          <HeaderText
            title={_('plan_types.page_title')}
            description={_('plan_types.page_description')}
            comment={_('plan_types.page_comment')}
          />
          <div className="dp-container">
            <div className="dp-rowflex">
              <section className="col-sm-12">
                <article>
                  <div className="dp-align-center">
                    {mappedPlanTypes.map((item, index) => (
                      <PlanTypeCard
                        key={`plan-type${index}`}
                        {...item}
                        queryParams={`${
                          isArgentina
                            ? `${queryParams}&promo-code=${process.env.REACT_APP_PROMOCODE_ARGENTINA}`
                            : queryParams
                        }`}
                      />
                    ))}
                  </div>
                </article>
              </section>
              <section className="col-sm-12">
                <div className="dp-banner-big">
                  <div className="col-sm-12 col-md-9 dp-banner-content">
                    <div className="dp-content-banner">
                      <h3>{_('plan_types.agency_banner.title')}</h3>
                      <p>{_('plan_types.agency_banner.description')}</p>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 text-align--right">
                    <Link
                      to="/email-marketing-for-agencies"
                      className="dp-button button-medium ctaTertiary"
                    >
                      {_('plan_types.agency_banner.button_text')}
                    </Link>
                  </div>
                </div>
              </section>
              <section className="dp-banner-payment-methods">
                <h4 className="dp-tit-payment-methods">
                  {_('plan_types.payment_methods_banner.title')}
                </h4>
                <span className="dp-mercado" />
                <span className="dp-visa" />
                <span className="dp-mastercard" />
                <span className="dp-american" />
                <span className="dp-bank">
                  <span className="dpicon iconapp-bank">
                    <span>{_('plan_types.payment_methods_banner.transfer_label')}</span>
                  </span>
                </span>
              </section>
              <FeaturesPlanTypes />
              <HeaderText
                title={_('plan_types.functionality_header.title')}
                description={_('plan_types.functionality_header.description')}
                comment={_('plan_types.functionality_header.comment')}
                Container={ScrollElement}
                containerProps={{ name: 'functionalities' }}
              />
              <section className="col-sm-12 m-t-24 m-b-36">
                {tables.map((table, index) => (
                  <div key={`table${index}`} className="dp-table-plans m-b-36">
                    <ScrollElement name={table.name}>
                      <header className="dp-header-plans dp-rowflex">
                        <div className="col-lg-6 col-md-12">
                          <h3>{table.headerTitle}</h3>
                        </div>
                      </header>
                    </ScrollElement>
                    <div className="dp-table-responsive">
                      <table className="dp-c-table dp-nested-table">
                        <tbody>
                          {table.items.map((item, index) => (
                            <TableRow key={`row-${index}`} row={item} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </section>
      </div>
    );
  },
);

const commonFeatures = [
  <FormattedMessage id={'plan_types.features_plans.feature_1'} />,
  <FormattedMessage id={'plan_types.features_plans.feature_2'} />,
  <FormattedMessage id={'plan_types.features_plans.feature_3'} />,
  <FormattedMessage id={'plan_types.features_plans.feature_4'} />,
];

const featuresFree = [...commonFeatures];

const featuresContact = [
  ...commonFeatures,
  <FormattedMessage id={'plan_types.features_plans.feature_5'} />,
];

const featuresEmail = [
  ...commonFeatures,
  <FormattedMessage id={'plan_types.features_plans.feature_5'} />,
];

const featuresCredit = [
  ...commonFeatures,
  <FormattedMessage id={'plan_types.features_plans.feature_5'} />,
];

const allPlanTypes = [
  {
    planType: PLAN_TYPE.free,
    planName: <FormattedMessage id={'plan_types.free_plan.name_card'} />,
    description: <FormattedMessage id={'plan_types.free_plan.description_card'} />,
    comment: <FormattedMessage id={'plan_types.free_plan.comment_card'} />,
    features: featuresFree,
    disabled: true,
  },
  {
    planType: PLAN_TYPE.byContact,
    pathname: planByContactsUrl,
    planName: <FormattedMessage id={'plan_types.contact_plan.name_card'} />,
    description: <FormattedMessage id={'plan_types.contact_plan.description_card'} />,
    comment: <FormattedMessage id={'plan_types.contact_plan.comment_card'} />,
    features: featuresContact,
    ribbonText: <FormattedMessage id={'plan_types.contact_plan.ribbonText'} />,
    scrollTo: 'functionalities',
  },
  {
    planType: PLAN_TYPE.byEmail,
    pathname: planByEmailsUrl,
    planName: <FormattedMessage id={'plan_types.email_plan.name_card'} />,
    description: <FormattedMessage id={'plan_types.email_plan.description_card'} />,
    comment: <FormattedMessage id={'plan_types.email_plan.comment_card'} />,
    features: featuresEmail,
    scrollTo: 'functionalities',
  },
  {
    planType: PLAN_TYPE.byCredit,
    pathname: planByCreditsUrl,
    planName: <FormattedMessage id={'plan_types.credit_plan.name_card'} />,
    description: <FormattedMessage id={'plan_types.credit_plan.description_card'} />,
    comment: <FormattedMessage id={'plan_types.credit_plan.comment_card'} />,
    features: featuresCredit,
    scrollTo: 'functionalities',
  },
];

const tables = [
  {
    headerTitle: <FormattedMessage id={'plan_types.table.automation.title'} />,
    items: getMappedRows({ key: 'automation', quantityFeatures: 9 }),
    name: 'automation',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.campaings.title'} />,
    items: getMappedRows({ key: 'campaings', quantityFeatures: 10 }),
    name: 'campaing',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.integrations.title'} />,
    items: getMappedRows({ key: 'integrations', quantityFeatures: 38 }),
    name: 'integrations',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.editor.title'} />,
    items: getMappedRows({ key: 'editor', quantityFeatures: 6 }),
    name: 'editor',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.forms.title'} />,
    items: getMappedRows({ key: 'forms', quantityFeatures: 8 }),
    name: 'forms',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.omni.title'} />,
    items: getMappedRows({ key: 'omni', quantityFeatures: 3 }),
    name: 'omnicanalidad',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.report.title'} />,
    items: getMappedRows({ key: 'report', quantityFeatures: 7 }),
    name: 'reports',
  },
  {
    headerTitle: <FormattedMessage id={'plan_types.table.segmentation.title'} />,
    items: getMappedRows({ key: 'segmentation', quantityFeatures: 5 }),
    name: 'segmentation',
  },
];
