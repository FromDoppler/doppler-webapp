import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { GoBackButton } from './GoBackButton';
import { UnexpectedError } from '../UnexpectedError';
import { ContactsPlan } from './ContactsPlan';
import { CreditsPlan } from './CreditsPlan';
import { EmailsPlan } from './EmailsPlan';
import { IncludedFeatures } from './IncludedFeatures';
import { StickyPlanSummary } from './StickyPlanSummary';
import { AddOnsSection } from './AddOnsSection';
import { FAQSection } from './FAQSection';
import { NewPlanSelectionStyled } from './index.styles';

const MORE_THAN_100K_OPTION_VALUE = 'more-than-100000';
const LESS_THAN_100K_EMAILS_OPTION_VALUE = 'less-than-100000';
const MORE_THAN_10M_EMAILS_OPTION_VALUE = 'more-than-10000000';

const getPlanIndexByQueryOrSession = ({ plans, search, sessionPlan, planType }) => {
  const query = new URLSearchParams(search);
  const selectedPlanId = parseInt(query.get('selected-plan'), 10);
  const selectedPlanIndex = plans.findIndex((plan) => plan.id === selectedPlanId);
  const isCurrentPlanType = sessionPlan?.plan?.planType === planType;

  if (selectedPlanIndex >= 0) {
    return selectedPlanIndex;
  }

  const currentPlanIndex = plans.findIndex(
    (plan) => isCurrentPlanType && plan.id === sessionPlan.plan.idPlan,
  );

  if (planType === PLAN_TYPE.byContact && isCurrentPlanType) {
    const subscribersCount = Number(sessionPlan?.plan?.subscribersCount);
    const currentPlanCapacity =
      currentPlanIndex >= 0 ? (plans[currentPlanIndex]?.subscriberLimit ?? 0) : 0;

    if (!Number.isNaN(subscribersCount)) {
      if (currentPlanIndex >= 0 && subscribersCount <= currentPlanCapacity) {
        return currentPlanIndex + 1 < plans.length ? currentPlanIndex + 1 : currentPlanIndex;
      }

      const firstPlanWithMoreCapacityIndex = plans.findIndex(
        (plan) => (plan.subscriberLimit ?? 0) > subscribersCount,
      );

      if (firstPlanWithMoreCapacityIndex >= 0) {
        if (currentPlanIndex >= 0 && firstPlanWithMoreCapacityIndex <= currentPlanIndex) {
          return currentPlanIndex + 1 < plans.length ? currentPlanIndex + 1 : currentPlanIndex;
        }

        return firstPlanWithMoreCapacityIndex;
      }
    }
  }

  if (planType === PLAN_TYPE.byEmail && currentPlanIndex >= 0) {
    const currentEmails =
      plans[currentPlanIndex]?.emailsByMonth ?? plans[currentPlanIndex]?.emailQty ?? 0;
    const nextPlanIndex = plans.findIndex(
      (plan) => (plan.emailsByMonth ?? plan.emailQty ?? 0) > currentEmails,
    );

    return nextPlanIndex >= 0 ? nextPlanIndex : currentPlanIndex;
  }

  return currentPlanIndex >= 0 ? currentPlanIndex : 0;
};

export const NewPlanSelection = InjectAppServices(
  ({ dependencies: { appSessionRef, planService } }) => {
    const { search } = useLocation();
    const sessionPlan = appSessionRef.current.userData.user;
    const [plansByContact, setPlansByContact] = useState([]);
    const [plansByCredit, setPlansByCredit] = useState([]);
    const [plansByEmail, setPlansByEmail] = useState([]);
    const [selectedContactPlanIndex, setSelectedContactPlanIndex] = useState(0);
    const [selectedCreditPlanIndex, setSelectedCreditPlanIndex] = useState(0);
    const [selectedEmailPlanIndex, setSelectedEmailPlanIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMoreThan100kSelected, setIsMoreThan100kSelected] = useState(false);
    const [isLessThan100kEmailsSelected, setIsLessThan100kEmailsSelected] = useState(false);
    const [isMoreThan10mEmailsSelected, setIsMoreThan10mEmailsSelected] = useState(false);
    const [stickySummaryData, setStickySummaryData] = useState(null);

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const [fetchedPlansByContact, fetchedPlansByCredit, fetchedPlansByEmail] =
            await Promise.all([
              planService.getPlansByType(PLAN_TYPE.byContact, { includeDowngrades: true }),
              planService.getPlansByType(PLAN_TYPE.byCredit),
              planService.getPlansByType(PLAN_TYPE.byEmail, { includeDowngrades: true }),
            ]);
          setPlansByContact(fetchedPlansByContact);
          setPlansByCredit(fetchedPlansByCredit);
          setPlansByEmail(fetchedPlansByEmail);
          setSelectedContactPlanIndex(
            fetchedPlansByContact.length
              ? getPlanIndexByQueryOrSession({
                  plans: fetchedPlansByContact,
                  search,
                  sessionPlan,
                  planType: PLAN_TYPE.byContact,
                })
              : 0,
          );
          setSelectedCreditPlanIndex(
            fetchedPlansByCredit.length
              ? getPlanIndexByQueryOrSession({
                  plans: fetchedPlansByCredit,
                  search,
                  sessionPlan,
                  planType: PLAN_TYPE.byCredit,
                })
              : 0,
          );
          setSelectedEmailPlanIndex(
            fetchedPlansByEmail.length
              ? getPlanIndexByQueryOrSession({
                  plans: fetchedPlansByEmail,
                  search,
                  sessionPlan,
                  planType: PLAN_TYPE.byEmail,
                })
              : 0,
          );
          setIsMoreThan100kSelected(false);
          setIsLessThan100kEmailsSelected(false);
          setIsMoreThan10mEmailsSelected(false);
          setHasError(false);
        } catch (error) {
          setHasError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();
    }, [planService, search, sessionPlan]);

    const selectedContactPlan = plansByContact[selectedContactPlanIndex] ?? null;
    const selectedCreditPlan = plansByCredit[selectedCreditPlanIndex] ?? null;
    const selectedEmailPlan = plansByEmail[selectedEmailPlanIndex] ?? null;
    const isCurrentPlanByCredit = sessionPlan?.plan?.planType === PLAN_TYPE.byCredit;
    const isCurrentPlanByEmail =
      sessionPlan?.plan?.planType === PLAN_TYPE.byEmail && !sessionPlan?.plan?.isFreeAccount;

    const handlePlanChange = (event) => {
      const { value } = event.target;

      if (value === MORE_THAN_100K_OPTION_VALUE) {
        setIsMoreThan100kSelected(true);
        setSelectedContactPlanIndex((currentPlanIndex) =>
          Math.max(currentPlanIndex, plansByContact.length - 1),
        );
        return;
      }

      setIsMoreThan100kSelected(false);
      setSelectedContactPlanIndex(parseInt(value, 10));
    };

    const handleCreditsPlanChange = (event) => {
      setSelectedCreditPlanIndex(parseInt(event.target.value, 10));
    };

    const handleEmailsPlanChange = (event) => {
      const { value } = event.target;

      if (value === LESS_THAN_100K_EMAILS_OPTION_VALUE) {
        setIsLessThan100kEmailsSelected(true);
        setIsMoreThan10mEmailsSelected(false);
        setSelectedEmailPlanIndex(0);
        return;
      }

      if (value === MORE_THAN_10M_EMAILS_OPTION_VALUE) {
        setIsLessThan100kEmailsSelected(false);
        setIsMoreThan10mEmailsSelected(true);
        setSelectedEmailPlanIndex(Math.max(0, plansByEmail.length - 1));
        return;
      }

      setIsLessThan100kEmailsSelected(false);
      setIsMoreThan10mEmailsSelected(false);
      setSelectedEmailPlanIndex(parseInt(value, 10));
    };

    if (loading) {
      return <Loading page />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    if (
      (!isCurrentPlanByEmail && plansByContact.length === 0 && plansByCredit.length === 0) ||
      (isCurrentPlanByEmail && plansByEmail.length === 0)
    ) {
      return (
        <NewPlanSelectionStyled>
          <div className="dp-container p-b-48">
            <div className="dp-new-plan-selection-header">
              <div className="dp-new-plan-selection-back">
                <GoBackButton goBackUrl="/my-plan" />
              </div>
              <h2 className="dp-first-order-title dp-new-plan-selection-title">
                <FormattedMessage id="buy_process.new_plan_selection.title" />
                <span className="dpicon iconapp-email-alert" />
              </h2>
            </div>
            <div className="dp-wrap-message dp-wrap-info">
              <span className="dp-message-icon" />
              <div className="dp-content-message">
                <FormattedMessage
                  id={
                    isCurrentPlanByEmail
                      ? 'buy_process.new_plan_selection.empty_emails_message'
                      : 'buy_process.new_plan_selection.empty_message'
                  }
                />
              </div>
            </div>
          </div>
        </NewPlanSelectionStyled>
      );
    }

    const creditsPlanSection = !!plansByCredit.length && (
      <div className="dp-new-plan-selection-credits-fullwidth">
        <CreditsPlan
          plans={plansByCredit}
          selectedPlanIndex={selectedCreditPlanIndex}
          onPlanChange={handleCreditsPlanChange}
          sessionPlan={sessionPlan}
          selectedPlan={selectedCreditPlan}
          search={search}
        />
      </div>
    );

    return (
      <NewPlanSelectionStyled>
        <div className="dp-container p-b-48 dp-new-plan-selection-layout">
          <header className="dp-new-plan-selection-header">
            <div className="dp-new-plan-selection-back">
              <GoBackButton goBackUrl="/my-plan" />
            </div>
            <h2 className="dp-first-order-title dp-new-plan-selection-title">
              <FormattedMessage id="buy_process.new_plan_selection.title" />
              <span className="dpicon iconapp-email-alert" />
            </h2>
            <p className="dp-new-plan-selection-subtitle">
              <FormattedMessage id="buy_process.new_plan_selection.subtitle" />
            </p>
          </header>
          {isCurrentPlanByCredit && creditsPlanSection}
          <div className="dp-rowflex">
            <div className="col-lg-12 col-md-12">
              <StickyPlanSummary summary={stickySummaryData} />
              {isCurrentPlanByEmail ? (
                <EmailsPlan
                  plans={plansByEmail}
                  selectedPlanIndex={selectedEmailPlanIndex}
                  isLessThan100kSelected={isLessThan100kEmailsSelected}
                  isMoreThan10mSelected={isMoreThan10mEmailsSelected}
                  onPlanChange={handleEmailsPlanChange}
                  onStickySummaryChange={setStickySummaryData}
                  sessionPlan={sessionPlan}
                  selectedPlan={selectedEmailPlan}
                  search={search}
                />
              ) : (
                <ContactsPlan
                  plans={plansByContact}
                  selectedPlanIndex={selectedContactPlanIndex}
                  isMoreThan100kSelected={isMoreThan100kSelected}
                  onPlanChange={handlePlanChange}
                  onStickySummaryChange={setStickySummaryData}
                  sessionPlan={sessionPlan}
                  selectedPlan={selectedContactPlan}
                  search={search}
                  keepControlsEnabled={isCurrentPlanByCredit}
                />
              )}
              <IncludedFeatures />
            </div>
          </div>
        </div>
        {!isCurrentPlanByCredit && !isCurrentPlanByEmail && creditsPlanSection}
        <div className="dp-container">
          <AddOnsSection />
        </div>
        <FAQSection />
      </NewPlanSelectionStyled>
    );
  },
);
