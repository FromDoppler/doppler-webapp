import React, { useEffect, useState, useReducer } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { CreditCard, getCreditCardBrand } from '../../Checkout/PaymentMethod/CreditCard';
import { StatusMessage } from '../../Checkout/PurchaseSummary/PlanPurchase/index';
import { MercadoPagoArgentina } from '../../Checkout/PaymentMethod/MercadoPagoArgentina';
import { actionPage } from '../../Checkout/Checkout';
import { getFormInitialValues } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';
import { Form, Formik, Field } from 'formik';
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

const considerationNoteStyle = {
  fontSize: '13px',
  lineHeight: '18px',
};

const FormatMessageWithBoldWords = ({ id }) => {
  return (
    <FormattedMessage
      id={id}
      values={{
        bold: (chunks) => <b>{chunks}</b>,
      }}
    />
  );
};

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

const none = 'NONE';
const HAS_ERROR = 'HAS_ERROR';
const SAVED = 'SAVED';
export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;

const paymentMethods = [
  {
    value: PaymentMethodType.creditCard,
    description: 'checkoutProcessForm.payment_method.credit_card_option',
  },
  {
    value: PaymentMethodType.mercadoPago,
    description: 'checkoutProcessForm.payment_method.mercado_pago',
  },
];

const countriesAvailableTransfer = ['ar', 'co', 'mx'];
const countriesAvailableMercadoPago = ['ar'];

const PaymentType = ({ paymentMethodType, optionView, paymentMethod }) => {
  return (
    <>
      {(() => {
        switch (paymentMethodType) {
          case PaymentMethodType.creditCard:
            return <CreditCard optionView={optionView} paymentMethod={paymentMethod}></CreditCard>;
          case PaymentMethodType.mercadoPago:
            return <MercadoPagoArgentina optionView={optionView} paymentMethod={paymentMethod} />;
          default:
            return null;
        }
      })()}
    </>
  );
};

const PaymentMethodField = ({ billingCountry, currentPaymentMethod, optionView, handleChange }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const allowTransfer = countriesAvailableTransfer.find((c) => c === billingCountry);
  const allowMercadoPago = countriesAvailableMercadoPago.find((c) => c === billingCountry);

  return (
    <Field name="paymentMethodName">
      {({ field }) => (
        <ul role="group" aria-labelledby="checkbox-group" className="dp-radio-input">
          {paymentMethods.map((paymentMethod) =>
            (paymentMethod.value === PaymentMethodType.transfer && allowTransfer) ||
            (paymentMethod.value === PaymentMethodType.mercadoPago && allowMercadoPago) ||
            paymentMethod.value === PaymentMethodType.creditCard ? (
              <li key={paymentMethod.value}>
                <div className="dp-volume-option">
                  <label>
                    <input
                      aria-label={paymentMethod.description}
                      id={paymentMethod.value}
                      type="radio"
                      name={fieldNames.paymentMethodName}
                      {...field}
                      value={paymentMethod.value}
                      checked={field.value === paymentMethod.value}
                      disabled={
                        (optionView === actionPage.READONLY &&
                          field.value !== paymentMethod.value) ||
                        (optionView === actionPage.UPDATE &&
                          paymentMethod.value === PaymentMethodType.transfer &&
                          currentPaymentMethod !== PaymentMethodType.transfer &&
                          currentPaymentMethod !== none)
                      }
                      onChange={handleChange}
                    />
                    {paymentMethod.value !== PaymentMethodType.mercadoPago ? (
                      <span>{_(paymentMethod.description)}</span>
                    ) : (
                      <span>
                        <img
                          src={_('common.ui_library_image', {
                            imageUrl: 'mercado-pago.svg',
                          })}
                          alt="Mercado pago"
                        ></img>
                      </span>
                    )}
                  </label>
                </div>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </Field>
  );
};

const PaymentNotes = ({ paymentMethodType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  switch (paymentMethodType) {
    case PaymentMethodType.creditCard:
      return (
        <FieldGroup>
          <li className="field-item">
            <div className="dp-considerations">
              <label>{_('checkoutProcessForm.payment_method.considerations')}</label>
              <p style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_credit_card_note_1" />
              </p>
              <br />
              <p style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_credit_card_note_2" />
              </p>
            </div>
          </li>
        </FieldGroup>
      );

    case PaymentMethodType.mercadoPago:
      return (
        <FieldGroup>
          <li className="field-item">
            <div className="dp-considerations">
              <label>{_('checkoutProcessForm.payment_method.considerations')}</label>
              <p className="m-t-12" style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_mercado_pago_note_1" />
              </p>
              <br />
              <p style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_mercado_pago_note_2" />
              </p>
              <br />
              <p style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_mercado_pago_note_3" />
              </p>
            </div>
          </li>
        </FieldGroup>
      );
    default:
      return null;
  }
};

export const UpdatePaymentMethod = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient }, optionView, handleSaveAndContinue }) => {
    const [{ loading, paymentMethod, billingCountry, hasError }, dispatch] = useReducer(
      updatePaymentInformationReducer,
      INITIAL_STATE_UPDATE_PAYMENT_INFORMATION,
    );

    const intl = useIntl();
    const createTimeout = useTimeout();
    const navigate = useNavigate();
    const [paymentMethodType, setPaymentMethodType] = useState('');
    const [status, setStatus] = useState('');
    const [errorMessageId, setErrorMessageId] = useState('');
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: UPDATE_PAYMENT_INFORMATION_ACTIONS.START_FETCH });
          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
          const billingInformationResult =
            await dopplerBillingUserApiClient.getBillingInformationData();

          dispatch({
            type: UPDATE_PAYMENT_INFORMATION_ACTIONS.FINISH_FETCH,
            payload: {
              paymentMethod: paymentMethodData.value,
              billingCountry: billingInformationResult.value.country,
            },
          });

          setPaymentMethodType(paymentMethodData.value.paymentMethodName);
        } catch (error) {
          dispatch({ type: UPDATE_PAYMENT_INFORMATION_ACTIONS.FAIL_FETCH });
        }
      };
      fetchData();
    }, [dopplerBillingUserApiClient]);

    const handleChange = (e, setFieldValue) => {
      const { value } = e.target;
      setFieldValue(fieldNames.paymentMethodName, value);
      setPaymentMethodType(value);
    };

    const submitPaymentMethodForm = async (values) => {
      setStatus('');

      const result = await dopplerBillingUserApiClient.updatePaymentMethod({
        ...values,
        idSelectedPlan: 0,
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
          {({ setFieldValue }) => (
            <Form className="dp-form-payment-method m-l-24 m-b-12 m-r-24">
              <legend>{_('updatePaymentMethod.payment_method.title')}</legend>
              <fieldset>
                <FieldGroup>
                  <FieldItem className="field-item m-b-24">
                    <PaymentMethodField
                      billingCountry={billingCountry}
                      currentPaymentMethod={paymentMethodType}
                      optionView={optionView}
                      handleChange={(e) => handleChange(e, setFieldValue)}
                    />
                  </FieldItem>
                  <PaymentType
                    paymentMethodType={paymentMethodType}
                    optionView={optionView}
                    paymentMethod={paymentMethod}
                  />
                  <PaymentNotes paymentMethodType={paymentMethodType} />
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
