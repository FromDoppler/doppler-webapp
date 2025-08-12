import { AccountCancellationRequest } from './Modals/AccountCancellationRequest';
import { useState } from 'react';
import { CancellationWithoutRetentionModal } from './Modals/CancellationWithoutRetention';
import { InjectAppServices } from '../../../services/pure-di';
import { SuccessAccountCancellation } from './Modals/SuccessAccountCancellation';

export const CancellationAccount = InjectAppServices(
  ({ handleCancelAccount, dependencies: { appSessionRef } }) => {
    const [showAccountCancellationRequestModal, setShowAccountCancellationRequestModal] =
      useState(true);
    const [showWithoutRetentionModal, setShowWithoutRetentionModal] = useState(false);
    const [showSuccessAccountCancellationModal, setShowSuccessAccountCancellationModal] =
      useState(false);
    const [accountCancellationRequestData, setAccountCancellationRequestData] = useState({});

    const { plan } = appSessionRef.current.userData.user;

    const handleSubmit = (values) => {
      setAccountCancellationRequestData(values);
      setShowAccountCancellationRequestModal(false);

      if (plan.isFreeAccount) {
        setShowWithoutRetentionModal(true);
      } else {
        handleCancelAccount();
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
            plan={plan}
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
