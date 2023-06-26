import React, { useEffect, useState, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Step } from '../Checkout/Step/Step';
import { Link } from 'react-router-dom';
import UpdatePaymentMethod from './UpdatePaymentMethod';
import Reprocess from './Reprocess';
import {
  FirstDataError,
  MercadoPagoError,
  CloverError,
  PaymentMethodType,
} from '../../../doppler-types';
import { ContactInformation } from './ContactInformation/index';
import { Loading } from '../../Loading/Loading';
import {
  INITIAL_STATE_UPDATE_PAYMENT_INFORMATION,
  updatePaymentInformationReducer,
  UPDATE_PAYMENT_INFORMATION_ACTIONS,
} from './Reducers/updatePaymentInformationReducer';
import { UnexpectedError } from '../../shared/UnexpectedError/index';

const updatePaymentInformationteps = {
  paymentMethodInformation: 'payment-method-information',
  reprocessInformation: 'reprocess-information',
};

export const actionPage = {
  READONLY: 'readOnly',
  UPDATE: 'update',
};

export const handleMessage = (error) => {
  switch (error.response?.data) {
    case FirstDataError.invalidExpirationDate:
    case MercadoPagoError.invalidExpirationDate:
    case CloverError.invalidExpirationMonth:
    case CloverError.invalidExpirationYear:
      return 'checkoutProcessForm.payment_method.first_data_error.invalid_expiration_date';
    case FirstDataError.invalidCreditCardNumber:
    case FirstDataError.invalidCCNumber:
    case CloverError.invalidCreditCardNumber:
      return 'checkoutProcessForm.payment_method.first_data_error.invalid_credit_card_number';
    case FirstDataError.declined:
    case FirstDataError.doNotHonorDeclined:
    case MercadoPagoError.declinedOtherReason:
    case CloverError.declined:
      return 'checkoutProcessForm.payment_method.first_data_error.declined';
    case FirstDataError.suspectedFraud:
    case MercadoPagoError.suspectedFraud:
      return 'checkoutProcessForm.payment_method.first_data_error.suspected_fraud';
    case FirstDataError.insufficientFunds:
    case MercadoPagoError.insufficientFunds:
    case CloverError.insufficientFunds:
      return 'checkoutProcessForm.payment_method.first_data_error.insufficient_funds';
    case FirstDataError.cardVolumeExceeded:
      return 'checkoutProcessForm.payment_method.first_data_error.card_volume_exceeded';
    case MercadoPagoError.invalidSecurityCode:
    case CloverError.invalidSecurityCode:
      return 'checkoutProcessForm.payment_method.mercado_pago_error.invalid_security_code';
    default:
      return 'checkoutProcessForm.purchase_summary.error_message';
  }
};

const UpdatePaymentInformation = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient } }) => {
    const [{ loading, paymentMethod, hasError }, dispatch] = useReducer(
      updatePaymentInformationReducer,
      INITIAL_STATE_UPDATE_PAYMENT_INFORMATION,
    );

    const [activeStep, setActiveStep] = useState(updatePaymentInformationteps.reprocessInformation);
    const [paymentInformationAction, setPaymentInformationAction] = useState(actionPage.READONLY);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: UPDATE_PAYMENT_INFORMATION_ACTIONS.START_FETCH });
          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();

          dispatch({
            type: UPDATE_PAYMENT_INFORMATION_ACTIONS.FINISH_FETCH,
            payload: {
              paymentMethod: paymentMethodData.value,
            },
          });
        } catch (error) {
          dispatch({ type: UPDATE_PAYMENT_INFORMATION_ACTIONS.FAIL_FETCH });
        }
      };
      fetchData();
    }, [dopplerBillingUserApiClient]);

    const setNextStep = async () => {
      let nextStep = activeStep;

      switch (activeStep) {
        case updatePaymentInformationteps.reprocessInformation:
          nextStep = updatePaymentInformationteps.paymentMethodInformation;
          break;
        case updatePaymentInformationteps.paymentMethodInformation:
          nextStep = updatePaymentInformationteps.paymentMethodInformation;
          break;
        default:
          nextStep = updatePaymentInformationteps.reprocessInformation;
          break;
      }

      setActiveStep(nextStep);
    };

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    return (
      <>
        <section className="dp-library dp-bg-softgrey">
          <Helmet>
            <title>{_('updatePaymentMethod.title')}</title>
            <meta name="checkout" />
          </Helmet>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 m-t-48">
                {paymentMethod.paymentMethodName !== PaymentMethodType.transfer ? (
                  <h3 className="m-b-24 m-t-24">{_('updatePaymentMethod.title')}</h3>
                ) : null}
              </div>

              <div className="col-md-12 col-lg-7 m-b-24">
                <div className="dp-wrapper-payment-process">
                  {paymentMethod.paymentMethodName !== PaymentMethodType.transfer ? (
                    <ul className="dp-accordion">
                      <Step
                        active={activeStep === updatePaymentInformationteps.reprocessInformation}
                        title={_('updatePaymentMethod.reprocess.title')}
                        complete={
                          activeStep === updatePaymentInformationteps.paymentMethodInformation
                        }
                        stepNumber={1}
                        onActivate={() =>
                          setActiveStep(updatePaymentInformationteps.reprocessInformation)
                        }
                      >
                        <Reprocess
                          handleSaveAndContinue={() => {
                            setNextStep(activeStep);
                            setPaymentInformationAction(actionPage.READONLY);
                          }}
                        />
                      </Step>
                      <Step
                        active={
                          activeStep === updatePaymentInformationteps.paymentMethodInformation
                        }
                        title={_('updatePaymentMethod.payment_method.title')}
                        complete={
                          activeStep === updatePaymentInformationteps.paymentMethodInformation
                        }
                        stepNumber={2}
                        onActivate={() => {
                          setPaymentInformationAction(actionPage.UPDATE);
                          setActiveStep(updatePaymentInformationteps.paymentMethodInformation);
                        }}
                        lastStep={true}
                      >
                        <UpdatePaymentMethod
                          optionView={paymentInformationAction}
                          handleChangeView={(view) => {
                            setPaymentInformationAction(view);
                          }}
                        />
                      </Step>
                    </ul>
                  ) : (
                    <ul className="dp-accordion">
                      <ContactInformation />
                    </ul>
                  )}
                </div>
              </div>
              <div className="dp-space-l24"></div>
            </div>
          </section>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-lg-12 col-md-6 col-sm-12 m-b-24"></div>
              <div className="col-sm-12 m-b-24">
                <hr className="dp-h-divider" />
                <Link to={`/login`} className="dp-button button-medium primary-grey m-t-30 m-r-24">
                  {_('checkoutProcessForm.button_back')}
                </Link>
              </div>
            </div>
          </section>
        </section>
      </>
    );
  },
);

export default InjectAppServices(UpdatePaymentInformation);
