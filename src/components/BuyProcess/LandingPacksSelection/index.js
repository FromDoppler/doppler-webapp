import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
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
import {
  DELETE_LANDING_PAGES_ACTIONS,
  INITIAL_STATE_DELETE_LANDING_PAGES,
  deleteLandingPagesReducer,
} from './reducers/deleteLandingPagesReducer';
import { LandingPacksMessages } from './LandingPacksMessages';
import { DELAY_BEFORE_REDIRECT_TO_SUMMARY } from '../ShoppingCart/CheckoutButton';
import { ACCOUNT_TYPE, FREE_ACCOUNT, PAID_ACCOUNT } from '../../../utils';
import { useQueryParams } from '../../../hooks/useQueryParams';
import useTimeout from '../../../hooks/useTimeout';

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

const verifyIsTheSameLandingPacks = (contractedLandingPages, selectedLandingPacks) => {
  if (!contractedLandingPages && selectedLandingPacks?.length > 0) {
    return false;
  }

  if (contractedLandingPages?.length !== selectedLandingPacks?.length) {
    return false;
  }

  const finded = contractedLandingPages?.find(
    (clp) =>
      !selectedLandingPacks?.find(
        (slp) => slp.planId === clp.idPlan && slp.packagesQty === clp.packageQty,
      ),
  );
  return !finded;
};

export const LandingPacksSelection = InjectAppServices(
  ({
    dependencies: {
      appSessionRef,
      dopplerAccountPlansApiClient,
      dopplerLegacyClient,
      dopplerBillingUserApiClient,
    },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const query = useQueryParams();
    const createTimeout = useTimeout();
    const [selectedLandingPacks, setSelectedLandingPacks] = useState(null);
    const [landingPacksFormValues, setLandingPacksFormValues] = useState([]);
    const [showArchiveLandings, setShowArchiveLandings] = useState(false);
    const [isDowngrade, setIsDowngrade] = useState(false);
    const formRef = useRef();
    const {
      error,
      loading,
      landingPacks: allLandingPacks,
    } = useFetchLandingPacks(dopplerAccountPlansApiClient);
    const [
      {
        loading: loadingRemoveLandingPages,
        error: errorRemoveLandingPages,
        success: successRemoveLandingPages,
        removed: landingPagesRemoved,
      },
      dispatch,
    ] = useReducer(deleteLandingPagesReducer, INITIAL_STATE_DELETE_LANDING_PAGES);
    const selectedLandingPacksRef = useRef(null);
    selectedLandingPacksRef.current = selectedLandingPacks;
    const isDowngradeRef = useRef(null);
    isDowngradeRef.current = isDowngrade;
    const numberOfPublishedLandingsRef = useRef(null);

    const sessionPlan = appSessionRef.current.userData.user;
    const contractedLandingPagesRef = useRef(
      appSessionRef.current.userData.user.landings?.landingPacks,
    );
    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;
    const landingsEditorEnabled = appSessionRef?.current?.userData?.features?.landingsEditorEnabled;
    const { isFreeAccount } = sessionPlan.plan;

    const handleRemove = () => {
      const { resetForm } = formRef.current;
      setSelectedLandingPacks([]);
      resetForm && resetForm();
    };

    useEffect(() => {
      const fetchLandingPagesPublished = async () => {
        const numberOfPublishedLandings = await dopplerLegacyClient.getLandingPagesAmount(
          appSessionRef.current.userData.user.idUser,
        );
        numberOfPublishedLandingsRef.current = numberOfPublishedLandings;
      };

      fetchLandingPagesPublished();
    }, [dopplerLegacyClient, appSessionRef]);

    const handleSave = useCallback((landingPacks) => setSelectedLandingPacks(landingPacks), []);
    const handleLandingPagesDowngrade = useCallback(
      async (isDowngradeWithSelectedLandings) => {
        const _isDowngrade =
          isDowngradeWithSelectedLandings ||
          (contractedLandingPagesRef?.current?.length > 0 &&
            selectedLandingPacksRef.current?.length === 0);
        if (_isDowngrade) {
          const numberOfSelectedLandings =
            selectedLandingPacksRef.current.reduce(
              (landingsAmount, lp) => landingsAmount + lp.landingsQty * lp.packagesQty,
              0,
            ) || 0;
          const numberOfPublishedLandings = await dopplerLegacyClient.getLandingPagesAmount(
            appSessionRef.current.userData.user.idUser,
          );
          setShowArchiveLandings(numberOfPublishedLandings > numberOfSelectedLandings);
        } else {
          setShowArchiveLandings(false);
        }
        setIsDowngrade(_isDowngrade);
      },
      [dopplerLegacyClient, appSessionRef],
    );

    useEffect(() => {
      if (allLandingPacks?.length > 0) {
        if (
          contractedLandingPagesRef?.current?.length > 0 &&
          !selectedLandingPacksRef?.current?.length
        ) {
          const landingPacks = allLandingPacks?.map((lp) => {
            const landingPackFinded = contractedLandingPagesRef?.current.find(
              (ilp) => ilp.idPlan === lp.planId,
            );
            return { ...lp, packagesQty: landingPackFinded ? landingPackFinded.packageQty : 0 };
          });
          handleSave(filterPackagesEqualOrGreatherToZero(landingPacks));
          setLandingPacksFormValues(landingPacks);
        } else {
          const landingPacks = allLandingPacks?.map((lp) => {
            return { ...lp, packagesQty: 0 };
          });
          setLandingPacksFormValues(landingPacks);
        }
      }
    }, [allLandingPacks, handleSave, isDowngradeRef]);

    const handleRemoveLandings = () => {
      const resetLandingForm = async () => {
        if (contractedLandingPagesRef.current?.length > 0) {
          setLandingPacksFormValues(allLandingPacks?.map((lp) => ({ ...lp, packagesQty: 0 })));
          dispatch({
            type: DELETE_LANDING_PAGES_ACTIONS.REMOVED,
          });
        }
        handleRemove();
      };

      if (numberOfPublishedLandingsRef.current > 0) {
        setShowArchiveLandings(true);
      } else {
        resetLandingForm();
      }
    };

    const handleRemoveLandingsConfirm = () => {
      const removeLandings = async () => {
        if (contractedLandingPagesRef.current?.length > 0) {
          dispatch({
            type: DELETE_LANDING_PAGES_ACTIONS.FETCHING_STARTED,
          });
          const response = await dopplerBillingUserApiClient.cancellationLandings();
          if (response.success) {
            dispatch({
              type: DELETE_LANDING_PAGES_ACTIONS.FINISH_FETCH,
            });
            setLandingPacksFormValues(allLandingPacks?.map((lp) => ({ ...lp, packagesQty: 0 })));
            setShowArchiveLandings(false);
            contractedLandingPagesRef.current = [];
            createTimeout(() => {
              dispatch({
                type: DELETE_LANDING_PAGES_ACTIONS.INITIALIZE,
              });
            }, 2500);
            const accountType =
              query.get(ACCOUNT_TYPE) ?? isFreeAccount ? FREE_ACCOUNT : PAID_ACCOUNT;
            createTimeout(() => {
              window.location.href = `/checkout-summary?buyType=${BUY_LANDING_PACK}&${ACCOUNT_TYPE}=${accountType}`;
            }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
          } else {
            dispatch({
              type: DELETE_LANDING_PAGES_ACTIONS.FETCH_FAILED,
              payload: {
                error: response.error,
              },
            });
          }
        }
      };

      removeLandings();
    };

    if (!landingsEditorEnabled || isFreeAccount) {
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
                isDowngrade={isDowngrade}
                handleRemoveLandings={handleRemoveLandings}
                showArchiveLandings={showArchiveLandings}
                loadingRemoveLandingPages={loadingRemoveLandingPages}
              />
              <LandingPacksMessages
                showArchiveLandings={showArchiveLandings}
                loadingRemoveLandingPages={loadingRemoveLandingPages}
                errorRemoveLandingPages={errorRemoveLandingPages}
                successRemoveLandingPages={successRemoveLandingPages}
              />
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
                handleRemoveLandingPacks={handleRemoveLandingsConfirm}
                isEqualPlan={false}
                hidePromocode={true}
                buyType={BUY_LANDING_PACK}
                handleLandingPagesDowngrade={handleLandingPagesDowngrade}
                disabledLandingsBuy={
                  (isDowngrade && showArchiveLandings) ||
                  (!landingPagesRemoved &&
                    verifyIsTheSameLandingPacks(
                      contractedLandingPagesRef?.current,
                      selectedLandingPacks,
                    ))
                }
                landingPagesRemoved={landingPagesRemoved}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
