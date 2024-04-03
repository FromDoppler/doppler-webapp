import { useRef, useState } from 'react';
import { useFetchLandingPacks } from '../../../hooks/useFetchtLandingPacks';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { GoBackButton } from '../PlanSelection/GoBackButton';
import { BUY_LANDING_PACK, ShoppingCart } from '../ShoppingCart';
import { UnexpectedError } from '../UnexpectedError';
import { LandingPacks } from './LandingPacks';

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
    const [selectedLandingPacks, setSelectedLandingPacks] = useState(null);
    const formRef = useRef();
    const { error, loading, landingPacks } = useFetchLandingPacks(dopplerAccountPlansApiClient);

    const sessionPlan = appSessionRef.current.userData.user;

    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;

    const handleRemove = () => {
      const { resetForm } = formRef.current;
      setSelectedLandingPacks([]);
      resetForm && resetForm();
    };

    const handleSave = (landingPacks) => setSelectedLandingPacks(landingPacks);

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
            <h2 className="dp-first-order-title">¿Quieres agrega un pack de landings?</h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-lg-8 col-md-12">
              <div className="dp-container p-b-48">
                <div className="dp-rowflex">
                  <div className="col-sm-12">
                    <p>
                      Contactanos para que Lorem ipsum dolor sit amet consectetur. Ac eleifend diam
                      lobortis montes eget proin purus. Faucibus viverra suspendisse molestie
                      viverra.
                    </p>
                  </div>
                  <div className="col-sm-6 m-t-36">
                    <h6>
                      <strong>Subtitulo 1</strong>
                    </h6>
                    <p>
                      Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget
                      proin purus. Faucibus viverra suspendisse molestie viverra hac.
                    </p>
                  </div>
                  <div className="col-sm-6 m-t-36">
                    <h6>
                      <strong>Subtitulo 2</strong>
                    </h6>
                    <p>
                      Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget
                      proin purus. Faucibus viverra suspendisse molestie viverra hac.
                    </p>
                  </div>
                </div>
              </div>
              <LandingPacks
                landingPacks={landingPacks}
                selectedLandings={selectedLandingPacks}
                handleSave={handleSave}
                handleRemove={handleRemove}
                formRef={formRef}
              />
              <p>
                <i>*Fusce porttitor porta dolor, at ultrices mi dapibus in. </i>
              </p>
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
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
