import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { GoBackButton } from './GoBackButton';
import { UnexpectedError } from '../UnexpectedError';
import { ContactsPlan } from './ContactsPlan';
import { IncludedFeatures } from './IncludedFeatures';
import { NewPlanSelectionStyled } from './index.styles';

const MORE_THAN_100K_OPTION_VALUE = 'more-than-100000';
const getContactsPromocode = () => {
  const rawValue = process.env.REACT_APP_PROMOCODE_CONTACTS?.trim() || '';
  if (!rawValue || rawValue === 'undefined' || rawValue === 'null') {
    return '';
  }

  return rawValue;
};

const getPromocodeFromParams = (params) =>
  params.get('promo-code')?.trim() ||
  params.get('Promo-code')?.trim() ||
  params.get('PromoCode')?.trim() ||
  '';

const getPlanIndexByQueryOrSession = ({ plans, search, sessionPlan }) => {
  const query = new URLSearchParams(search);
  const selectedPlanId = parseInt(query.get('selected-plan'), 10);
  const selectedPlanIndex = plans.findIndex((plan) => plan.id === selectedPlanId);

  if (selectedPlanIndex >= 0) {
    return selectedPlanIndex;
  }

  const currentPlanIndex = plans.findIndex(
    (plan) =>
      sessionPlan?.plan?.planType === PLAN_TYPE.byContact && plan.id === sessionPlan.plan.idPlan,
  );

  return currentPlanIndex >= 0 ? currentPlanIndex : 0;
};

export const NewPlanSelection = InjectAppServices(
  ({ dependencies: { appSessionRef, planService } }) => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = sessionPlan.plan;
    const [plans, setPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMoreThan100kSelected, setIsMoreThan100kSelected] = useState(false);

    useEffect(() => {
      const contactsPromocode = getContactsPromocode();
      if (!contactsPromocode) {
        return;
      }

      if (!isFreeAccount) {
        return;
      }

      const params = new URLSearchParams(search);
      const currentPromocode = getPromocodeFromParams(params);
      if (currentPromocode) {
        return;
      }

      params.delete('PromoCode');
      params.delete('Promo-code');
      params.set('promo-code', contactsPromocode);
      navigate({ pathname, search: `?${params.toString()}` }, { replace: true });
    }, [isFreeAccount, navigate, pathname, search]);

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const plansByContact = await planService.getPlansByType(PLAN_TYPE.byContact);
          setPlans(plansByContact);
          setSelectedPlanIndex(
            plansByContact.length
              ? getPlanIndexByQueryOrSession({ plans: plansByContact, search, sessionPlan })
              : 0,
          );
          setIsMoreThan100kSelected(false);
          setHasError(false);
        } catch (error) {
          setHasError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();
    }, [planService, search, sessionPlan]);

    const selectedPlan = plans[selectedPlanIndex] ?? null;

    const handlePlanChange = (event) => {
      const { value } = event.target;

      if (value === MORE_THAN_100K_OPTION_VALUE) {
        setIsMoreThan100kSelected(true);
        setSelectedPlanIndex((currentPlanIndex) => Math.max(currentPlanIndex, plans.length - 1));
        return;
      }

      setIsMoreThan100kSelected(false);
      setSelectedPlanIndex(parseInt(value, 10));
    };

    if (loading) {
      return <Loading page />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    if (plans.length === 0) {
      return (
        <NewPlanSelectionStyled>
          <div className="dp-container p-b-48">
            <div className="dp-new-plan-selection-header">
              <div className="dp-new-plan-selection-back">
                <GoBackButton />
              </div>
              <h2 className="dp-first-order-title dp-new-plan-selection-title">
                <FormattedMessage id="buy_process.new_plan_selection.title" />
                <span className="dpicon iconapp-email-alert" />
              </h2>
            </div>
            <div className="dp-wrap-message dp-wrap-info">
              <span className="dp-message-icon" />
              <div className="dp-content-message">
                <FormattedMessage id="buy_process.new_plan_selection.empty_message" />
              </div>
            </div>
          </div>
        </NewPlanSelectionStyled>
      );
    }

    return (
      <NewPlanSelectionStyled>
        <div className="dp-container p-b-48">
          <header className="dp-new-plan-selection-header">
            <div className="dp-new-plan-selection-back">
              <GoBackButton />
            </div>
            <h2 className="dp-first-order-title dp-new-plan-selection-title">
              <FormattedMessage id="buy_process.new_plan_selection.title" />
              <span className="dpicon iconapp-email-alert" />
            </h2>
            <p className="dp-new-plan-selection-subtitle">
              <FormattedMessage id="buy_process.new_plan_selection.subtitle" />
            </p>
          </header>

          <div className="dp-rowflex">
            <div className="col-lg-12 col-md-12">
              <ContactsPlan
                plans={plans}
                selectedPlanIndex={selectedPlanIndex}
                isMoreThan100kSelected={isMoreThan100kSelected}
                onPlanChange={handlePlanChange}
                sessionPlan={sessionPlan}
                selectedPlan={selectedPlan}
                search={search}
              />
              <IncludedFeatures />
            </div>
          </div>
        </div>
      </NewPlanSelectionStyled>
    );
  },
);
