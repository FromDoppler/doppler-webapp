import { useEffect, useReducer, useState } from 'react';
import SafeRedirect from '../../../SafeRedirect';
import { useLinkedinInsightTag } from '../../../../hooks/useLinkedingInsightTag';
import HeaderSection from '../../../shared/HeaderSection/HeaderSection';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { paymentType } from '../PaymentMethod/PaymentMethod';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import {
  checkoutSummaryReducer,
  CHECKOUT_SUMMARY_ACTIONS,
  INITIAL_STATE_CHECKOUT_SUMMARY,
} from '../Reducers/checkoutSummaryReducer';
import { exception } from 'react-ga';
import { UnexpectedError } from '../../PlanCalculator/UnexpectedError';
import { ACCOUNT_TYPE, thousandSeparatorNumber } from '../../../../utils';
import { TransferInformation } from './TransferInformation/index';
import { CheckoutSummaryButton } from './CheckoutSummaryButton';
import { CheckoutSummaryTitle } from './CheckoutSummaryTitle/index';
import { MercadoPagoInformation } from './MercadoPagoInformation';
import { PLAN_TYPE } from '../../../../doppler-types';
import { Link } from 'react-router-dom';
import { AddOn } from '../../../shared/AddOn';
import { useFetchLandingPacks } from '../../../../hooks/useFetchtLandingPacks';
import useTimeout from '../../../../hooks/useTimeout';
import { Carousel } from '../../../Dashboard/LearnWithDoppler/Carousel/Carousel';
import { Slide } from '../../../Dashboard/LearnWithDoppler/Carousel/Slide/Slide';
import { BUY_LANDING_PACK } from '../../../BuyProcess/ShoppingCart';

export const AddOnLandingPack = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { cheapestLandingPack } = useFetchLandingPacks(dopplerAccountPlansApiClient);
    const query = useQueryParams();
    const accountType = query.get(ACCOUNT_TYPE) ?? '';

    return (
      <AddOn
        title={_('landing_selection.modal.title')}
        titleIconName="dpicon iconapp-landing-page"
        description={_('landing_selection.modal.description')}
        link1={{
          pathname: `/landing-packages${accountType ? `?${ACCOUNT_TYPE}=${accountType}` : ''}`,
          label: 'Mas información',
        }}
        link2={{
          pathname: `/landing-packages${accountType ? `?${ACCOUNT_TYPE}=${accountType}` : ''}`,
          label: 'Comprar ahora',
        }}
        priceComponent={
          <FormattedMessage
            id="landing_selection.pack_from"
            values={{
              price: cheapestLandingPack?.price || 0,
            }}
          />
        }
      />
    );
  },
);

export const FormatMessageWithSpecialStyle = ({ id }) => {
  return (
    <FormattedMessage
      id={id}
      values={{
        underline: (chunks) => <u>{chunks}</u>,
        bold: (chunks) => <b>{chunks}</b>,
      }}
    />
  );
};

const getTitle = (paymentMethod, upgradePending) => {
  if (paymentMethod === paymentType.transfer && upgradePending) {
    return {
      smallTitle: 'checkoutProcessSuccess.transfer_purchase_finished_title',
      largeTitle: 'checkoutProcessSuccess.transfer_title',
      description: 'checkoutProcessSuccess.transfer_warning_message',
    };
  } else {
    if (paymentMethod === paymentType.mercadoPago && upgradePending) {
      return {
        smallTitle: 'checkoutProcessSuccess.mercado_pago_purchase_finished_title',
        largeTitle: 'checkoutProcessSuccess.transfer_title',
        description: 'checkoutProcessSuccess.mercado_pago_warning_message',
      };
    }
  }
  return {
    smallTitle: 'checkoutProcessSuccess.purchase_finished_title',
    largeTitle: 'checkoutProcessSuccess.title',
  };
};

const PlanBuyMessage = ({ title, paymentMethod, upgradePending }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <div className={`dp-wrap-message dp-wrap-${upgradePending ? 'warning' : 'success'}`}>
        <span className="dp-message-icon" />
        <div className="dp-content-message dp-content-full">
          <p>
            <strong>{_(title.largeTitle)}</strong>
            <br />
            {[paymentType.mercadoPago, paymentType.transfer].includes(paymentMethod) &&
            upgradePending
              ? _(title.description)
              : 'Ya puedes empezar a disfrutar de los beneficios de tus planes de Doppler.'}
          </p>
          <Link to="/dashboard" className="dp-message-link">
            IR AL INICIO
          </Link>
        </div>
      </div>
    </>
  );
};

const PlanMarketingInformation = ({
  planType,
  quantity,
  discount,
  extraCredits,
  remainingCredits,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h4 className="dp-tit-plan-purchased">Tu plan de email marketing</h4>
      <ul className="dp-purchase-summary-list">
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type`)}</span>
          <h3>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_label`)}</h3>
        </li>
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}`)}</span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, quantity)}</h3>
        </li>
        {extraCredits > 0 ? (
          <li>
            <span>{_(`checkoutProcessSuccess.plan_type_prepaid_promocode`)}</span>
            <h3>{thousandSeparatorNumber(intl.defaultLocale, extraCredits)}</h3>
          </li>
        ) : null}
        <li>
          <span>
            {_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_availables`)}
          </span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, remainingCredits)}</h3>
        </li>
        <li>
          <span>Facturación</span>
          {planType === PLAN_TYPE.byContact && discount ? (
            <>
              <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
              <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
            </>
          ) : planType === PLAN_TYPE.byEmail ? (
            <>
              <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
              <h3>{_(`checkoutProcessSuccess.plan_type_monthly_deliveries_monthly_renovation`)}</h3>
            </>
          ) : (
            <h3>{_(`checkoutProcessSuccess.plan_type_prepaid_no_expiration`)}</h3>
          )}
        </li>
      </ul>
    </>
  );
};

// const PlanInformation = ({
//   planType,
//   quantity,
//   discount,
//   paymentMethod,
//   extraCredits,
//   remainingCredits,
//   upgradePending,
// }) => {
//   const intl = useIntl();
//   const _ = (id, values) => intl.formatMessage({ id: id }, values);

//   return (
//     <nav className="dp-kpi-success">
//       <ul className="dp-rowflex">
//         <li>
//           <span className="dp-icon-kpis">
//             <img
//               src={_('common.ui_library_image', {
//                 imageUrl: `${
//                   paymentMethod === paymentType.creditCard ||
//                   ([paymentType.transfer, paymentType.mercadoPago].includes(paymentMethod) &&
//                     !upgradePending)
//                     ? 'checkout-success.svg'
//                     : 'three-points.svg'
//                 }`,
//               })}
//               alt=""
//             ></img>
//           </span>
//         </li>
//         <li>
//           <span>{_(`checkoutProcessSuccess.plan_type`)}</span>
//           <h3>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_label`)}</h3>
//         </li>
//         <li>
//           <span>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}`)}</span>
//           <h3>{thousandSeparatorNumber(intl.defaultLocale, quantity)}</h3>
//         </li>
//         {extraCredits > 0 ? (
//           <li>
//             <span>{_(`checkoutProcessSuccess.plan_type_prepaid_promocode`)}</span>
//             <h3>{thousandSeparatorNumber(intl.defaultLocale, extraCredits)}</h3>
//           </li>
//         ) : null}
//         <li>
//           <span>
//             {_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_availables`)}
//           </span>
//           <h3>{thousandSeparatorNumber(intl.defaultLocale, remainingCredits)}</h3>
//         </li>
//         <li>
//           {planType === PLAN_TYPE.byContact && discount ? (
//             <>
//               <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
//               <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
//             </>
//           ) : planType === PLAN_TYPE.byEmail ? (
//             <>
//               <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
//               <h3>{_(`checkoutProcessSuccess.plan_type_monthly_deliveries_monthly_renovation`)}</h3>
//             </>
//           ) : (
//             <h3 className="m-t-36">
//               {_(`checkoutProcessSuccess.plan_type_prepaid_no_expiration`)}
//             </h3>
//           )}
//         </li>
//       </ul>
//     </nav>
//   );
// };

export const CheckoutSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    location,
  }) => {
    useLinkedinInsightTag();
    const [
      {
        loading,
        billingCountry,
        paymentMethod,
        planType,
        discount,
        quantity,
        extraCredits,
        remainingCredits,
        hasError,
      },
      dispatch,
    ] = useReducer(checkoutSummaryReducer, INITIAL_STATE_CHECKOUT_SUMMARY);

    const query = useQueryParams();
    const redirect = query.get('redirect');
    const legacy = query.get('legacy');
    const planId = query.get('planId') ?? '';
    const paymentMethodType = query.get('paymentMethod') ?? '';
    const discountDescription = query.get('discount') ?? '';
    const extraCreditsByPromocode = query.get('extraCredits') ?? 0;
    const buyType = query.get('buyType') ?? '';
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const upgradePending = appSessionRef.current.userData.user.plan.upgradePending;

    useEffect(() => {
      const fetchBillingInformationData = async () => {
        const data = await dopplerBillingUserApiClient.getBillingInformationData();
        if (data.success) {
          return data;
        } else {
          throw new exception();
        }
      };

      const fetchCurrentUserPlan = async () => {
        const data = await dopplerBillingUserApiClient.getCurrentUserPlanData();
        if (data.success) {
          return data;
        } else {
          throw new exception();
        }
      };

      const fetchData = async () => {
        try {
          dispatch({ type: CHECKOUT_SUMMARY_ACTIONS.START_FETCH });
          const billingInformationData = await fetchBillingInformationData();
          const currentUserPlanData = await fetchCurrentUserPlan();

          dispatch({
            type: CHECKOUT_SUMMARY_ACTIONS.FINISH_FETCH,
            payload: {
              billingInformation: billingInformationData.value,
              currentUserPlan: currentUserPlanData.value,
              extraCredits: extraCreditsByPromocode,
              discount: discountDescription,
              paymentMethod: paymentMethodType,
            },
          });
        } catch (error) {
          dispatch({ type: CHECKOUT_SUMMARY_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      extraCreditsByPromocode,
      discountDescription,
      paymentMethodType,
      planId,
    ]);

    if (legacy) {
      if (redirect) {
        return <SafeRedirect to={`/${redirect}`} />;
      }
      return <SafeRedirect to="/Campaigns/Draft" />;
    }

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    const title = getTitle(paymentMethod, upgradePending);
    const isBuyMarketingPlan = buyType && Number(buyType) !== BUY_LANDING_PACK;
    const landingsEditorEnabled = appSessionRef?.current?.userData?.features?.landingsEditorEnabled;

    return (
      <>
        <Helmet>
          <title>{_('checkoutProcessSuccess.purchase_finished_title')}</title>
          <meta name="checkout-success" />
        </Helmet>
        <HeaderSection>
          <CheckoutSummaryTitle title={title} hideBreadcrumb={!isBuyMarketingPlan} />
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-8 m-b-24">
              <PlanBuyMessage
                title={title}
                paymentMethod={paymentMethod}
                upgradePending={upgradePending}
              />
              {isBuyMarketingPlan && (
                <PlanMarketingInformation
                  planType={planType}
                  quantity={quantity}
                  discount={discount}
                  extraCredits={extraCredits}
                  remainingCredits={remainingCredits}
                />
              )}
              {paymentMethod === paymentType.transfer ? (
                <TransferInformation
                  billingCountry={billingCountry}
                  upgradePending={upgradePending}
                />
              ) : paymentMethod === paymentType.mercadoPago ? (
                <MercadoPagoInformation upgradePending={upgradePending} />
              ) : null}

              {isBuyMarketingPlan && (
                <CheckoutSummaryButton
                  paymentMethod={paymentMethod}
                  upgradePending={upgradePending}
                />
              )}
            </div>
            {landingsEditorEnabled && (
              <div className="col-sm-4 m-b-24">
                <div className="dp-wrapper-addons">
                  <h2>
                    {_('landing_selection.pack_addons_title')}
                    <span className="dpicon iconapp-add-product" />
                  </h2>
                  <AddOnLandingPack />
                </div>
              </div>
            )}
          </div>
          {isBuyMarketingPlan && landingsEditorEnabled && <ModalPromoLandingPacks />}
        </section>
      </>
    );
  },
);

const landingPacksSlides = [
  {
    id: 1,
    img: 'pic-carousel.svg',
  },
  {
    id: 2,
    img: 'pic-carousel.svg',
  },
  {
    id: 3,
    img: 'pic-carousel.svg',
  },
];

export const ModalPromoLandingPacks = () => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const query = useQueryParams();
  const accountType = query.get(ACCOUNT_TYPE) ?? '';
  const createTimeout = useTimeout();

  useEffect(() => {
    createTimeout(() => setOpen(true), 800);
  }, [createTimeout]);

  const closeModal = () => setOpen(false);

  if (!open) {
    return <></>;
  }

  return (
    <div className="modal" id="modal-medium">
      <div className="modal-content--medium">
        <div className="dp-modal-pack-landing">
          <Carousel
            id="1"
            color="orange"
            ariaLabel="landing-packs"
            numberOfItems={3}
            showDots={false}
          >
            {({ activeSlide }) =>
              landingPacksSlides.map((slide, index) => (
                <Slide key={slide.id} active={activeSlide === index}>
                  <img
                    src={_('common.ui_library_image', { imageUrl: slide.img })}
                    alt="Check list"
                  />
                </Slide>
              ))
            }
          </Carousel>
          <h3>{_('landing_selection.modal.title')}</h3>
          <p>{_('landing_selection.modal.description')}</p>

          <Link
            to={`/landing-packages${accountType ? `?${ACCOUNT_TYPE}=${accountType}` : ''}`}
            className="dp-button button-medium primary-green"
          >
            {_('landing_selection.modal.link_to_buy')}
          </Link>
          <button type="button" className="dp-button link-green" onClick={closeModal}>
            {_('landing_selection.modal.close_button')}
          </button>
        </div>
      </div>
    </div>
  );
};
