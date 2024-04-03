import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetchLandingPacks } from '../../../hooks/useFetchtLandingPacks';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { GoBackButton } from '../PlanSelection/GoBackButton';
import { BUY_LANDING_PACK, ShoppingCart } from '../ShoppingCart';
import { UnexpectedError } from '../UnexpectedError';
import { LandingPacks, filterPackagesEqualOrGreatherToZero } from './LandingPacks';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

export const paymentFrequenciesListForLandingPacks = [
  {
    numberMonths: 12,
    subscriptionType: 'yearly',
    discountPercentage: 25,
  },
  {
    numberMonths: 6,
    subscriptionType: 'half_yearly',
    discountPercentage: 15,
  },
  {
    numberMonths: 3,
    subscriptionType: 'quarterly',
    discountPercentage: 5,
  },
  {
    numberMonths: 1,
    subscriptionType: 'monthly',
    discountPercentage: 0,
  },
];

export const LandingPacksSelection = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerAccountPlansApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [selectedLandingPacks, setSelectedLandingPacks] = useState(null);
    const [landingPacksFormValues, setLandingPacksFormValues] = useState([]);
    const [isLandingPagesDowngrade, setIsLandingPagesDowngrade] = useState(false);
    const formRef = useRef();
    const {
      error,
      loading,
      landingPacks: allLandingPacks,
    } = useFetchLandingPacks(dopplerAccountPlansApiClient);

    const sessionPlan = appSessionRef.current.userData.user;

    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;

    const handleRemove = () => {
      const { resetForm } = formRef.current;
      setSelectedLandingPacks([]);
      resetForm && resetForm();
    };

    const handleSave = useCallback((landingPacks) => setSelectedLandingPacks(landingPacks), []);
    const handleLandingPagesDowngrade = useCallback(
      (isDowngrade) => setIsLandingPagesDowngrade(isDowngrade),
      [],
    );

    useEffect(() => {
      const contractedLandingPages = appSessionRef.current.userData.user.landings?.landingPacks;
      if (
        allLandingPacks?.length > 0 &&
        contractedLandingPages?.length > 0 &&
        !selectedLandingPacks?.length
      ) {
        const landingPacks = allLandingPacks?.map((lp) => {
          const landingPackFinded = contractedLandingPages.find((ilp) => ilp.idPlan === lp.planId);
          return { ...lp, packagesQty: landingPackFinded ? landingPackFinded.packageQty : 0 };
        });
        handleSave(filterPackagesEqualOrGreatherToZero(landingPacks));
        setLandingPacksFormValues(landingPacks);
      } else if (!selectedLandingPacks?.length) {
        const landingPacks = allLandingPacks?.map((lp) => ({ ...lp, packagesQty: 0 }));
        setLandingPacksFormValues(landingPacks);
      }
    }, [allLandingPacks, appSessionRef, selectedLandingPacks, handleSave]);

    if (!appSessionRef?.current?.userData?.features?.landingsEditorEnabled) {
      return <Navigate to="/dashboard" />;
    }

    if (loading) {
      return <Loading page />;
    }

    if (error) {
      return <UnexpectedError />;
    }

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">{_('landing_selection.title')}</h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-lg-8 col-md-12">
              <div className="dp-container p-b-48">
                <div className="dp-rowflex">
                  <div className="col-sm-12">
                    <p>{_('landing_selection.description')}</p>
                  </div>
                  <div className="col-sm-6 m-t-36">
                    <h6>
                      <strong>{_('landing_selection.subtitle1')}</strong>
                    </h6>
                    <p>
                      <FormattedMessage
                        id={'landing_selection.description1'}
                        values={{
                          strong: (chunks) => <strong>{chunks}</strong>,
                        }}
                      />
                    </p>
                  </div>
                  <div className="col-sm-6 m-t-36">
                    <h6>
                      <strong>{_('landing_selection.subtitle2')}</strong>
                    </h6>
                    <p>
                      <FormattedMessage
                        id={'landing_selection.description2'}
                        values={{
                          strong: (chunks) => <strong>{chunks}</strong>,
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <LandingPacks
                landingPacks={landingPacksFormValues}
                handleSave={handleSave}
                formRef={formRef}
              />
              {isLandingPagesDowngrade && (
                <div className="dp-wrap-message dp-wrap-warning m-t-12">
                  <span className="dp-message-icon" />
                  <div className="dp-content-message dp-content-full">
                    <p>
                      <strong>EN CONSTRUCCION</strong> - No puedes reducir el número o quitar
                      landings pages mientras se encuentren publicadas. Archiva las landing pages
                      antes de reducir el número o quitar todas.
                    </p>
                    <a href="https://app.fromdoppler.com/login" className="dp-message-link">
                      VER MIS LANDINGS PAGES
                    </a>
                  </div>
                </div>
              )}
              <hr className="dp-separator" />
              <div className="m-t-18 m-b-18">
                <GoBackButton />
              </div>
            </div>
            <div className="col-lg-4 col-sm-12">
              <ShoppingCart
                discountConfig={{
                  paymentFrequenciesList: paymentFrequenciesListForLandingPacks,
                  selectedPaymentFrequency: paymentFrequenciesListForLandingPacks.find(
                    (pf) => pf.numberMonths === sessionPlan.plan.planSubscription,
                  ),
                  onSelectPaymentFrequency: () => null,
                  disabled: true,
                  showBanner: false,
                  currentSubscriptionUser: sessionPlan.plan.planSubscription,
                }}
                isMonthlySubscription={isMonthlySubscription}
                landingPacks={selectedLandingPacks}
                handleRemoveLandingPacks={handleRemove}
                isEqualPlan={false}
                hidePromocode={true}
                buyType={BUY_LANDING_PACK}
                handleLandingPagesDowngrade={handleLandingPagesDowngrade}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
