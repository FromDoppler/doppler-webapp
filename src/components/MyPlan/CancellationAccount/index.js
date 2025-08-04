import { useState } from 'react';
import { CancellationAccountModal } from './Modal';
import { InjectAppServices } from '../../../services/pure-di';
import { CancellationWithoutRetentionModal } from './CancellationWithoutRetentionModal';

export const CancellationAccount = InjectAppServices(
  ({ handleCancelAccount, dependencies: { appSessionRef } }) => {
    const [open, setOpen] = useState(true);
    const [withoutRetentionModalOpen, setWithoutRetentionModalOpen] = useState(false);

    const closeFormModal = () => {
      setOpen(false);
      handleCancelAccount();
    };

    const closeCancellationWithoutRetentionModalModal = () => {
      setWithoutRetentionModalOpen(false);
    };

    const { plan } = appSessionRef.current.userData.user;

    const followingButton = () => {
      setOpen(false);

      if (plan.isFreeAccount) {
        setWithoutRetentionModalOpen(true); 
      } else {
        handleCancelAccount();
      }
    };

    return (
      <>
        {open && (
          <CancellationAccountModal
            showModal={true}
            handleCloseModal={closeFormModal}
            handleSubmit={followingButton}
          ></CancellationAccountModal>
        )}
        {withoutRetentionModalOpen && (
          <CancellationWithoutRetentionModal
            showModal={true}
            handleCloseModal={closeCancellationWithoutRetentionModalModal}
          ></CancellationWithoutRetentionModal>
        )}
      </>
    );
  },
);
