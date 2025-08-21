import { AccountCancellationRequest } from './Modals/AccountCancellationRequest';
import { useState } from 'react';
import { CancellationWithoutRetentionModal } from './Modals/CancellationWithoutRetention';
import { InjectAppServices } from '../../../services/pure-di';
import { SuccessAccountCancellation } from './Modals/SuccessAccountCancellation';
import { AccountCancellationFlow, PLAN_TYPE } from '../../../doppler-types';
import { ConsultingOffer } from './Modals/ConsultingOffer';

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
      return AccountCancellationFlow.lessOrEqual500ContactsOrCredits;
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
          //values.cancellationReason => "notAchieveMyExpectedGoals"

          if (values.cancellationReason === "notAchieveMyExpectedGoals") {
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
    }

    const handleSuccessSetScheduledCancellation = () => {
      setShowConsultingOfferModal(false);
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
          ></ConsultingOffer>
        )}
      </>
    );
  },
);
