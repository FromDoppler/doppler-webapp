import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { AddOnType } from '../../../../../doppler-types';
import { InjectAppServices } from '../../../../../services/pure-di';
import { AddOnCancellationModal } from '../../../CancellationAccount/Modals/AddOnCancellation';
import { SuccessAddOnCancellation } from '../../../CancellationAccount/Modals/SuccessAddOnCancellation';

export const AddOnCancellationFlow = InjectAppServices(({ addOnType, canCancel = false }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [showAddOnCancellationModal, setShowAddOnCancellationModal] = useState(false);
  const [showSuccessAddOnCancellationModal, setShowSuccessAddOnCancellationModal] = useState(false);

  const handleCloseModal = () => {
    setShowAddOnCancellationModal(false);
  };

  const handleSuccessCancelAddOn = () => {
    setShowAddOnCancellationModal(false);
    setShowSuccessAddOnCancellationModal(true);
  };

  const cancelAddOnPlan = async () => {
    setShowAddOnCancellationModal(true);
  };

  if (!canCancel) {
    return null;
  }

  return (
    <>
      <button
        aria-label="cancel-plan"
        className="dp-button button-medium dp-w-100 btn-cancel"
        onClick={() => cancelAddOnPlan()}
        type="button"
      >
        {_(`my_plan.subscription_details.cancel_addon_button`)}
      </button>
      {showAddOnCancellationModal && (
        <AddOnCancellationModal
          addOnType={addOnType}
          handleCloseModal={handleCloseModal}
          handleSuccessCancelAddOn={handleSuccessCancelAddOn}
        ></AddOnCancellationModal>
      )}
      {showSuccessAddOnCancellationModal && <SuccessAddOnCancellation></SuccessAddOnCancellation>}
    </>
  );
});

AddOnCancellationFlow.propTypes = {
  addOnType: PropTypes.oneOf(Object.values(AddOnType)).isRequired,
  canCancel: PropTypes.bool,
};
