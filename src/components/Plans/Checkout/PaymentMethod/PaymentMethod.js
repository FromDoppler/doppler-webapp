import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, Form, Formik } from 'formik';
import { Loading } from '../../../Loading/Loading';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { getFormInitialValues, extractParameter } from '../../../../utils';
import { FieldGroup, FieldItem, SubmitButton } from '../../../form-helpers/form-helpers';
import { actionPage } from '../Checkout';
import { CreditCard, getCreditCardBrand } from './CreditCard';
import { Transfer } from './Transfer/Transfer';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PLAN_TYPE,
  FirstDataError,
  CloverError,
  PaymentMethodType,
  AutomaticDebitError,
} from '../../../../doppler-types';
import { MercadoPagoArgentina } from './MercadoPagoArgentina';
import { AutomaticDebit } from './AutomaticDebit/AutomaticDebit';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

const none = 'NONE';
const userCanceledError = 'UserCanceled';
const isNotCreditCardError = 'IsNotCreditCard';
const isNotAllowCreditCard = 'IsNotAllowCreditCard';

export const fieldNames = {
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
  taxRegime: 'taxRegime',
  taxCertificate: 'taxCertificate',
  cbu: 'cbu',
  withHoldingAgent: 'withHoldingAgent',
};

export const paymentType = {
  creditCard: 'CC',
  mercadoPago: 'MP',
  transfer: 'TRANSF',
  automaticDebit: 'DA',
};

const paymentMethods = [
  {
    value: paymentType.creditCard,
    description: 'checkoutProcessForm.payment_method.credit_card_option',
  },
  {
    value: paymentType.transfer,
    description: 'checkoutProcessForm.payment_method.transfer',
  },
  {
    value: paymentType.mercadoPago,
    description: 'checkoutProcessForm.payment_method.mercado_pago',
  },
  {
    value: paymentType.automaticDebit,
    description: 'checkoutProcessForm.payment_method.automatic_debit',
  },
];

const countriesAvailableTransfer = ['ar', 'co', 'mx'];
const countriesAvailableMercadoPago = ['ar'];
const countriesAvailableAutomaticDebit = ['ar'];

//TODO: Remove the stykes when the UI Library is updated
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

const PaymentMethodField = ({
  billingCountry,
  currentPaymentMethod,
  paymentMethodAlreadyRegistered,
  optionView,
  handleChange,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const allowTransfer = countriesAvailableTransfer.find((c) => c === billingCountry);
  const allowMercadoPago = countriesAvailableMercadoPago.find((c) => c === billingCountry);
  const allowAutomaticDebit = countriesAvailableAutomaticDebit.find((c) => c === billingCountry);

  return (
    <Field name="paymentMethodName">
      {({ field }) => (
        <ul role="group" aria-labelledby="checkbox-group" className="dp-radio-input">
          {paymentMethods.map((paymentMethod) =>
            (paymentMethod.value === paymentType.transfer && allowTransfer) ||
            (paymentMethod.value === paymentType.mercadoPago && allowMercadoPago) ||
            paymentMethod.value === paymentType.creditCard ||
            (paymentMethod.value === paymentType.automaticDebit && allowAutomaticDebit) ? (
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
                          paymentMethod.value === paymentType.transfer &&
                          currentPaymentMethod !== paymentType.transfer &&
                          paymentMethodAlreadyRegistered)
                      }
                      onChange={handleChange}
                    />
                    {paymentMethod.value !== paymentType.mercadoPago ? (
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

const PaymentType = ({ paymentMethodType, optionView, paymentMethod }) => {
  return (
    <>
      {(() => {
        switch (paymentMethodType) {
          case paymentType.creditCard:
            return <CreditCard optionView={optionView} paymentMethod={paymentMethod}></CreditCard>;
          case paymentType.transfer:
            return <Transfer optionView={optionView} paymentMethod={paymentMethod}></Transfer>;
          case paymentType.mercadoPago:
            return <MercadoPagoArgentina optionView={optionView} paymentMethod={paymentMethod} />;
          case paymentType.automaticDebit:
            return <AutomaticDebit optionView={optionView} paymentMethod={paymentMethod} />;
          default:
            return <CreditCard optionView={optionView} paymentMethod={paymentMethod}></CreditCard>;
        }
      })()}
    </>
  );
};

const PaymentNotes = ({ paymentMethodType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  switch (paymentMethodType) {
    case paymentType.creditCard:
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

    case paymentType.mercadoPago:
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

    case paymentType.automaticDebit:
      return (
        <FieldGroup>
          <li className="field-item">
            <div className="dp-considerations">
              <label>{_('checkoutProcessForm.payment_method.considerations')}</label>
              <p style={considerationNoteStyle}>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.considerations_automatic_debit_note_1" />
              </p>
            </div>
          </li>
        </FieldGroup>
      );

    default:
      return null;
  }
};

const PromoCodeInformation = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <FieldGroup>
      <li className="field-item">
        <div className="dp-wrap-subscription">
          <div className="dp-wrap-message dp-wrap-info">
            <span className="dp-message-icon"></span>
            <div className="dp-content-message">
              <p>{_('checkoutProcessForm.payment_method.applied_promocode_tooltip')}</p>
            </div>
          </div>
        </div>
      </li>
    </FieldGroup>
  );
};

export const PaymentMethod = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    showTitle,
    handleSaveAndContinue,
    handleChangeView,
    handleChangeDiscount,
    handleChangePaymentMethod,
    optionView,
    appliedPromocode,
  }) => {
    const location = useLocation();
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;
    let selectedDiscountId = extractParameter(location, queryString.parse, 'discountId') || 0;
    const selectedMonthPlan = extractParameter(location, queryString.parse, 'monthPlan') || 0;
    const intl = useIntl();
    const [state, setState] = useState({
      loading: true,
      paymentMethod: { paymentMethodName: PaymentMethodType.creditCard },
    });
    const [discountsInformation, setDiscountsInformation] = useState({
      selectedPlanDiscount: undefined,
      discounts: [],
      plan: {},
      changed: false,
    });
    const [error, setError] = useState({ error: false, message: '' });
    const navigate = useNavigate();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType } = useParams();

    useEffect(() => {
      const fetchData = async () => {
        const sessionPlan = appSessionRef.current.userData.user;
        const billingInformationResult =
          await dopplerBillingUserApiClient.getBillingInformationData();

        const allowTransfer = countriesAvailableTransfer.find(
          (c) => c === billingInformationResult.value.country,
        );

        const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();

        let paymentMethodToShow = paymentMethodData.success
          ? paymentMethodData.value
          : { paymentMethodName: paymentType.creditCard };
        if (
          paymentMethodData.success &&
          ![none, ''].includes(paymentMethodData.value.paymentMethodName)
        ) {
          if (
            paymentMethodData.value.paymentMethodName === paymentType.transfer &&
            !allowTransfer
          ) {
            handleChangeView(actionPage.UPDATE);
          } else if (paymentMethodData.value.paymentMethodName !== paymentType.creditCard) {
            handleChangePaymentMethod(paymentMethodToShow.paymentMethodName);
          }
        } else {
          handleChangeView(actionPage.UPDATE);
        }

        let discounts = [];
        let selectedPlanDiscount = undefined;

        if (planType === PLAN_TYPE.byContact) {
          const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
            selectedPlan,
            paymentMethodToShow.paymentMethodName,
          );

          discounts = discountsData.success ? discountsData.value : [];
          selectedPlanDiscount = discountsData.success
            ? discountsData.value.find((d) => d.monthsAmmount.toString() === selectedMonthPlan)
            : undefined;
        }

        setDiscountsInformation({
          selectedPlanDiscount,
          discounts,
          plan: sessionPlan.plan,
          changed: true,
        });

        setState({
          billingCountry: billingInformationResult.value.country,
          paymentMethod: paymentMethodToShow,
          loading: false,
          currentPaymentMethod: paymentMethodToShow.paymentMethodName,
          paymentMethodAlreadyRegistered: paymentMethodData.success
            ? paymentMethodData.value.paymentMethodName !== none
            : true,
        });
      };
      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      appSessionRef,
      selectedPlan,
      selectedDiscountId,
      handleChangeView,
      planType,
      handleChangeDiscount,
      handleChangePaymentMethod,
      discountsInformation.changed,
      selectedMonthPlan,
    ]);

    const getDiscountData = async (selectedPlan, paymentMethod) => {
      const sessionPlan = appSessionRef.current.userData.user;
      const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
        selectedPlan,
        paymentMethod,
      );

      const discount = discountsData.success
        ? discountsData.value.find((d) => d.id.toString() === selectedDiscountId)
        : undefined;

      setDiscountsInformation({
        selectedPlanDiscount: discount ?? discountsData.value[0],
        discounts: discountsData.success ? discountsData.value : [],
        plan: sessionPlan.plan,
      });
    };

    const handleChange = (e, setFieldValue) => {
      const { value } = e.target;
      setFieldValue(fieldNames.paymentMethodName, value);
      getDiscountData(selectedPlan, value);
      setError(false);
      handleChangePaymentMethod(value);
    };

    const submitPaymentMethodForm = async (values) => {
      setError({ error: false, message: '' });
      const result = await dopplerBillingUserApiClient.updatePaymentMethod({
        ...values,
        discountId: discountsInformation.selectedPlanDiscount,
        ccType: getCreditCardBrand(values.number),
        idSelectedPlan: selectedPlan,
      });

      const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();

      setState({
        ...state,
        paymentMethod: paymentMethodData.success ? paymentMethodData.value : {},
      });

      if (result.success) {
        setError({ error: false, message: '' });
        handleSaveAndContinue();
      } else {
        if (result.error.response.data === userCanceledError) {
          navigate('/login');
        } else {
          setError({ error: true, message: handleMessage(result.error) });
        }
      }
    };

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);

      initialValues[fieldNames.paymentMethodName] = state.paymentMethod.paymentMethodName;

      return initialValues;
    };

    const handleMessage = (error) => {
      switch (error.response.data) {
        case FirstDataError.invalidExpirationDate:
        case CloverError.invalidExpirationMonth:
        case CloverError.invalidExpirationYear:
        case CloverError.invalidExpirationCard:
          return 'checkoutProcessForm.payment_method.first_data_error.invalid_expiration_date';
        case FirstDataError.invalidCreditCardNumber:
        case FirstDataError.invalidCCNumber:
        case CloverError.invalidCreditCardNumber:
          return 'checkoutProcessForm.payment_method.first_data_error.invalid_credit_card_number';
        case FirstDataError.declined:
        case FirstDataError.doNotHonorDeclined:
        case CloverError.declined:
          return 'checkoutProcessForm.payment_method.first_data_error.declined';
        case FirstDataError.suspectedFraud:
          return 'checkoutProcessForm.payment_method.first_data_error.suspected_fraud';
        case FirstDataError.insufficientFunds:
        case CloverError.insufficientFunds:
          return 'checkoutProcessForm.payment_method.first_data_error.insufficient_funds';
        case FirstDataError.cardVolumeExceeded:
          return 'checkoutProcessForm.payment_method.first_data_error.card_volume_exceeded';
        case isNotCreditCardError:
          return 'checkoutProcessForm.payment_method.only_credit_card_error';
        case isNotAllowCreditCard:
          return 'checkoutProcessForm.payment_method.not_allow_credit_card_error';
        case AutomaticDebitError.cbuInvalid:
          return 'checkoutProcessForm.payment_method.automatic_debit_error.invalid_cbu';
        default:
          return 'checkoutProcessForm.payment_method.error';
      }
    };

    return (
      <>
        {showTitle ? (
          <div className="dp-accordion-thumb">{_('checkoutProcessForm.payment_method.title')}</div>
        ) : null}
        {state.loading ? (
          <Loading page />
        ) : (
          <Formik initialValues={_getFormInitialValues()} onSubmit={submitPaymentMethodForm}>
            {({ values, setFieldValue }) => (
              <Form className="dp-form-payment-method">
                <legend>{_('checkoutProcessForm.payment_method.title')}</legend>
                <fieldset className="dp-form-fields">
                  <FieldGroup>
                    <FieldItem className="field-item m-b-24">
                      <PaymentMethodField
                        billingCountry={state.billingCountry}
                        currentPaymentMethod={state.currentPaymentMethod}
                        paymentMethodAlreadyRegistered={state.paymentMethodAlreadyRegistered}
                        optionView={optionView}
                        handleChange={(e) => handleChange(e, setFieldValue)}
                      />
                    </FieldItem>
                    <PaymentType
                      paymentMethodType={values[fieldNames.paymentMethodName]}
                      optionView={optionView}
                      paymentMethod={state.paymentMethod}
                    />
                    {appliedPromocode ? <PromoCodeInformation /> : null}
                    <PaymentNotes paymentMethodType={values[fieldNames.paymentMethodName]} />
                    {error.error ? (
                      <FieldItem className="field-item">
                        <div className="dp-wrap-message dp-wrap-cancel">
                          <span className="dp-message-icon"></span>
                          <div className="dp-content-message">
                            <p>
                              <FormattedMessageMarkdown id={error.message} />
                            </p>
                          </div>
                        </div>
                      </FieldItem>
                    ) : null}
                  </FieldGroup>
                </fieldset>
                {optionView === actionPage.UPDATE ? (
                  <fieldset className="dp-footer-button m-t-18">
                    <div className="dp-buttons-actions">
                      <SubmitButton className="dp-button button-medium primary-green">
                        {_('checkoutProcessForm.save_continue')}
                      </SubmitButton>
                    </div>
                  </fieldset>
                ) : null}
              </Form>
            )}
          </Formik>
        )}
      </>
    );
  },
);
