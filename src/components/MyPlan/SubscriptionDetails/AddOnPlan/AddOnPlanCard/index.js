import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { AddOnType } from '../../../../../doppler-types';
import { AddOnCancellationModal } from '../../../CancellationAccount/Modals/AddOnCancellation';
import { SuccessAddOnCancellation } from '../../../CancellationAccount/Modals/SuccessAddOnCancellation';
import { HeaderStyled } from '../index.style';

export const AddOnPlanCard = ({
  title,
  iconClassName,
  description,
  actions,
  showPromotionInformation,
  promotionInformation,
  promotionClassName = 'm-t-12',
  children,
  addOnType,
  canCancel = false,
}) => {
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

  return (
    <div className="dp-box-shadow m-b-24">
      <article className="dp-wrapper-plan">
        <header>
          <HeaderStyled className="dp-rowflex">
            <div className="col-lg-9 col-md-12">
              <div className="dp-title-plan">
                <h3 className="dp-second-order-title">
                  <span className="p-r-8 m-r-6">{title}</span>
                  <span className={iconClassName} />
                </h3>
                {description}
              </div>
            </div>
            <div className="col-lg-3 col-md-12">
              <div className="dp-buttons--plan">
                {actions}
                {canCancel && (
                  <button
                    aria-label="cancel-plan"
                    className="dp-button button-medium dp-w-100 btn-cancel"
                    onClick={() => cancelAddOnPlan()}
                    type="button"
                  >
                    {_(`my_plan.subscription_details.cancel_addon_button`)}
                  </button>
                )}
              </div>
            </div>
          </HeaderStyled>
        </header>
        {showPromotionInformation && (
          <div className={`dp-wrap-message dp-wrap-info ${promotionClassName}`}>
            <span className="dp-message-icon" />
            <div className="dp-content-message dp-content-full">
              <p>{promotionInformation}</p>
            </div>
          </div>
        )}
        {children}
      </article>
      {showAddOnCancellationModal && (
        <AddOnCancellationModal
          addOnType={addOnType}
          handleCloseModal={handleCloseModal}
          handleSuccessCancelAddOn={handleSuccessCancelAddOn}
        ></AddOnCancellationModal>
      )}
      {showSuccessAddOnCancellationModal && <SuccessAddOnCancellation></SuccessAddOnCancellation>}
    </div>
  );
};

AddOnPlanCard.propTypes = {
  title: PropTypes.node.isRequired,
  iconClassName: PropTypes.string.isRequired,
  description: PropTypes.node,
  actions: PropTypes.node.isRequired,
  showPromotionInformation: PropTypes.bool,
  promotionInformation: PropTypes.node,
  promotionClassName: PropTypes.string,
  children: PropTypes.node,
  addOnType: PropTypes.oneOf(Object.values(AddOnType)),
  canCancel: PropTypes.bool,
};
