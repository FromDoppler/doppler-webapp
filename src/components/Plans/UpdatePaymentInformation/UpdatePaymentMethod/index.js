import React, { useEffect, useState, useReducer } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { CreditCard, getCreditCardBrand } from '../../Checkout/PaymentMethod/CreditCard';
import { StatusMessage } from '../../Checkout/PurchaseSummary/PlanPurchase/index';
import { MercadoPagoArgentina } from '../../Checkout/PaymentMethod/MercadoPagoArgentina';
import { actionPage } from '../../Checkout/Checkout';
import { getFormInitialValues } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';
import { Form, Formik } from 'formik';
import { FieldGroup, FieldItem, SubmitButton } from '../../../form-helpers/form-helpers';
import { PaymentMethodType } from '../.././../../doppler-types';
import { handleMessage } from '../index';
import {
  INITIAL_STATE_UPDATE_PAYMENT_INFORMATION,
  updatePaymentInformationReducer,
  UPDATE_PAYMENT_INFORMATION_ACTIONS,
} from '../Reducers/updatePaymentInformationReducer';
import { UnexpectedError } from '../../../shared/UnexpectedError/index';
import { useNavigate } from 'react-router-dom';
import useTimeout from '../../../../hooks/useTimeout';

const fieldNames = {
  paymentMethodName: 'paymentMethodName',
  paymentType: 'paymentType',
  paymentWay: 'paymentWay',
  bankName: 'bankName',
  bankAccount: 'bankAccount',
  number: 'number',
  name: 'name',
  expiry: 'expiry',
  cvc: 'cvc',
  consumerType: 'consumerType',
  businessName: 'businessName',
  identificationNumber: 'identificationNumber',
  responsableIVA: 'responsableIVA',
  cfdi: 'cfdi',
};

const HAS_ERROR = 'HAS_ERROR';
const SAVED = 'SAVED';
export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;

const PaymentType = ({ paymentMethodType, optionView }) => {
  return (
    <>
      {(() => {
        switch (paymentMethodType) {
          case PaymentMethodType.creditCard:
            return <CreditCard optionView={optionView}></CreditCard>;
          case PaymentMethodType.mercadoPago:
            return <MercadoPagoArgentina optionView={optionView} />;
          default:
            return null;
        }
      })()}
    </>
  );
};

export const UpdatePaymentMethod = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient }, optionView, handleSaveAndContinue }) => {
    const [{ loading, paymentMethod, hasError }, dispatch] = useReducer(
      updatePaymentInformationReducer,
      INITIAL_STATE_UPDATE_PAYMENT_INFORMATION,
    );

    const intl = useIntl();
    const createTimeout = useTimeout();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [errorMessageId, setErrorMessageId] = useState('');
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

    const submitPaymentMethodForm = async (values) => {
      const result = await dopplerBillingUserApiClient.updatePaymentMethod({
        ...values,
        ccType: getCreditCardBrand(values.number),
      });

      if (result.success) {
        const reprocessResult = await dopplerBillingUserApiClient.reprocess();

        if (reprocessResult.success) {
          setStatus(SAVED);

          createTimeout(() => {
            navigate(
              `/payment-information-summary?allInvoicesProcessed=${reprocessResult.value.allInvoicesProcessed}&success=${reprocessResult.success}&anyPendingInvoices=${reprocessResult.value.anyPendingInvoices}`,
            );
          }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
        } else {
          setErrorMessageId(handleMessage(result.error));
          setStatus(HAS_ERROR);
        }
      } else {
        setErrorMessageId(handleMessage(result.error));
        setStatus(HAS_ERROR);
      }
    };

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);

      initialValues[fieldNames.paymentMethodName] = paymentMethod.paymentMethodName;

      return initialValues;
    };

    const showMessage = [SAVED, HAS_ERROR].includes(status);

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    return (
      <>
        <Formik initialValues={_getFormInitialValues()} onSubmit={submitPaymentMethodForm}>
          {() => (
            <Form className="dp-form-payment-method">
              <legend>{_('updatePaymentMethod.payment_method.title')}</legend>
              <fieldset>
                <FieldGroup>
                  <PaymentType
                    paymentMethodType={paymentMethod.paymentMethodName}
                    optionView={optionView}
                    paymentMethod={paymentMethod}
                  />
                  {showMessage && (
                    <StatusMessage
                      type={status === SAVED ? 'success' : 'cancel'}
                      message={_(
                        status === SAVED
                          ? 'updatePaymentMethod.payment_method.success_message'
                          : errorMessageId,
                      )}
                    />
                  )}
                  {optionView === actionPage.UPDATE ? (
                    <FieldItem className="field-item">
                      <div className="dp-buttons-actions">
                        <SubmitButton className="dp-button button-medium primary-green">
                          {_('updatePaymentMethod.payment_method.save_continue_button')}
                        </SubmitButton>
                      </div>
                    </FieldItem>
                  ) : null}
                </FieldGroup>
              </fieldset>
            </Form>
          )}
        </Formik>
      </>
    );
  },
);

export default InjectAppServices(UpdatePaymentMethod);
