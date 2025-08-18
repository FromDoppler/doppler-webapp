import { AccountCancellationRequest } from './Modals/AccountCancellationRequest';
import { useState } from 'react';
import { CancellationWithoutRetentionModal } from './Modals/CancellationWithoutRetention';
import { InjectAppServices } from '../../../services/pure-di';
import { SuccessAccountCancellation } from './Modals/SuccessAccountCancellation';
import { AccountCancellationFlow, PLAN_TYPE } from '../../../doppler-types';

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
          handleCancelAccount();
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

    return (
      <>
        {showAccountCancellationRequestModal && (
          <AccountCancellationRequest
            accountCancellationFlow={accountCancellationFlow}
            handleSubmit={handleSubmit}
            handleCloseModal={handleAccountCancellationRequestModal}
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
      </>
    );
  },
);
