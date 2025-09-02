import { AccountCancellationRequest } from './Modals/AccountCancellationRequest';
import { useState } from 'react';
import { CancellationWithoutRetentionModal } from './Modals/CancellationWithoutRetention';
import { InjectAppServices } from '../../../services/pure-di';
import { SuccessAccountCancellation } from './Modals/SuccessAccountCancellation';
import { AccountCancellationFlow, PLAN_TYPE } from '../../../doppler-types';
import { ConsultingOffer } from './Modals/ConsultingOffer';
import { SuccessScheduledCancellation } from './Modals/SuccessScheduledCancellation';

const getCurrentFlow = (plan) => {
  if (plan.isFreeAccount) {
    return AccountCancellationFlow.free;
  } else {
    if (
      (plan.planType === PLAN_TYPE.byContact && plan.maxSubscribers >= 10000) ||
      plan.planType === PLAN_TYPE.byEmail
    ) {
      return AccountCancellationFlow.greaterOrEqual1000ContactsOrMonthly;
    } else {
      return AccountCancellationFlow.lessOrEqual5000ContactsOrCredits;
    }
  }
};

export const CancellationAccount = InjectAppServices(
  ({ handleCancelAccount, dependencies: { appSessionRef } }) => {
    const [showAccountCancellationRequestModal, setShowAccountCancellationRequestModal] =
      useState(true);
    const [showWithoutRetentionModal, setShowWithoutRetentionModal] = useState(false);
    const [showSuccessAccountCancellationModal, setShowSuccessAccountCancellationModal] =
      useState(false);
    const [accountCancellationRequestData, setAccountCancellationRequestData] = useState({});
    const [showConsultingOfferModal, setShowConsultingOfferModal] = useState(false);
    const [showSuccessScheduledCancellationModal, setShowSuccessScheduledCancellationModal] =
      useState(false);

    const { plan } = appSessionRef.current.userData.user;
    const accountCancellationFlow = getCurrentFlow(plan);

    const handleSubmit = (values) => {
      setShowAccountCancellationRequestModal(false);

      if (accountCancellationFlow === AccountCancellationFlow.free) {
        setAccountCancellationRequestData(values);
        setShowWithoutRetentionModal(true);
      } else {
        if (
          accountCancellationFlow === AccountCancellationFlow.greaterOrEqual1000ContactsOrMonthly
        ) {
          window.location.href = '/my-plan';
        } else {
          setAccountCancellationRequestData(values);

          if (values.cancellationReason === 'notAchieveMyExpectedGoals') {
            setShowConsultingOfferModal(true);
          }
        }
      }
    };

    const handleAccountCancellationRequestModal = () => {
      handleCancelAccount();
    };

    const handleCancellationWithoutRetentionModal = () => {
      handleCancelAccount();
    };

    const handleSuccessCancelAccount = () => {
      setShowSuccessAccountCancellationModal(true);
    };

    const handleReturnAccountCancellationRequest = () => {
      setShowConsultingOfferModal(false);
      setShowAccountCancellationRequestModal(true);
    };

    const handleSuccessSetScheduledCancellation = () => {
      setShowConsultingOfferModal(false);

      if (plan.planType === PLAN_TYPE.byContact) {
        setShowSuccessScheduledCancellationModal(true);
      } else {
        setShowWithoutRetentionModal(true);
      }
    };

    const handleCloseSuccessScheduledCancellationModal = () => {
      setShowSuccessScheduledCancellationModal(true);
      window.location.href = '/my-plan';
    };

    const handleCloseConsultingOffer = () => {
      setShowConsultingOfferModal(false);
      window.location.href = '/my-plan';
    };

    return (
      <>
        {showAccountCancellationRequestModal && (
          <AccountCancellationRequest
            accountCancellationFlow={accountCancellationFlow}
            handleSubmit={handleSubmit}
            handleCloseModal={handleAccountCancellationRequestModal}
            data={accountCancellationRequestData}
          ></AccountCancellationRequest>
        )}
        {showWithoutRetentionModal && (
          <CancellationWithoutRetentionModal
            accountCancellationRequest={accountCancellationRequestData}
            handleCloseModal={handleCancellationWithoutRetentionModal}
            handleSuccessCancelAccount={handleSuccessCancelAccount}
          ></CancellationWithoutRetentionModal>
        )}
        {showSuccessAccountCancellationModal && (
          <SuccessAccountCancellation></SuccessAccountCancellation>
        )}
        {showConsultingOfferModal && (
          <ConsultingOffer
            handleReturnAccountCancellationRequest={handleReturnAccountCancellationRequest}
            handleSuccessSetScheduledCancellation={handleSuccessSetScheduledCancellation}
            accountCancellationRequest={accountCancellationRequestData}
            planType={plan.planType}
            handleClose={handleCloseConsultingOffer}
          ></ConsultingOffer>
        )}
        {showSuccessScheduledCancellationModal && (
          <SuccessScheduledCancellation
            handleClose={handleCloseSuccessScheduledCancellationModal}
          ></SuccessScheduledCancellation>
        )}
      </>
    );
  },
);
