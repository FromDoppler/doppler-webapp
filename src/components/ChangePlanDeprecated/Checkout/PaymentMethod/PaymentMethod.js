import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, Form, Formik } from 'formik';
import { Loading } from '../../../Loading/Loading';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { getFormInitialValues, extractParameter } from '../../../../utils';
import { FieldGroup, FieldItem, SubmitButton } from '../../../form-helpers/form-helpers';
import { Discounts } from '../Discounts/Discounts';
import { actionPage } from '../Checkout';
import { CreditCard, getCreditCardBrand } from './CreditCard';
import { Transfer } from './Transfer';

const none = 'NONE';

export const fieldNames = {
  paymentMethodName: 'paymentMethodName',
  number: 'number',
  name: 'name',
  expiry: 'expiry',
  cvc: 'cvc',
  consumerType: 'consumerType',
  businessName: 'businessName',
  identificationNumber: 'identificationNumber',
};

export const paymentType = {
  creditCard: 'CC',
  mercadoPago: 'MP',
  transfer: 'TRANSF',
};

const paymentMethods = [
  {
    value: paymentType.creditCard,
    description: 'checkoutProcessForm.payment_method.credit_card',
  },
  {
    value: paymentType.transfer,
    description: 'checkoutProcessForm.payment_method.transfer',
  },
  {
    value: paymentType.mercadoPago,
    description: 'checkoutProcessForm.payment_method.mercado_pago',
  },
];

const countriesAvailableTransfer = ['ar', 'co', 'mx'];
const countriesAvailableMercadoPago = ['ar'];

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
            (paymentMethod.value === paymentType.transfer && allowTransfer) ||
            (paymentMethod.value === paymentType.mercadoPago && allowMercadoPago) ||
            paymentMethod.value === paymentType.creditCard ? (
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
                          currentPaymentMethod !== none)
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

const PaymentType = ({ paymentMethodType, optionView }) => {
  return (
    <>
      {(() => {
        switch (paymentMethodType) {
          case paymentType.creditCard:
            return <CreditCard optionView={optionView}></CreditCard>;
          case paymentType.transfer:
            return <Transfer optionView={optionView}></Transfer>;
          default:
            return null;
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
            <div className="dp-wrap-subscription">
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
    default:
      return null;
  }
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
  }) => {
    const location = useLocation();
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;
    let selectedDiscountId = extractParameter(location, queryString.parse, 'discountId') || 0;
    const intl = useIntl();
    const [state, setState] = useState({ loading: true, paymentMethod: {} });
    const [discountsInformation, setDiscountsInformation] = useState({
      selectedPlanDiscount: undefined,
      discounts: [],
      plan: {},
    });
    const [error, setError] = useState(false);
    const [paymentMethodType, setPaymentMethodType] = useState('');
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        const sessionPlan = appSessionRef.current.userData.user;
        const billingInformationResult =
          await dopplerBillingUserApiClient.getBillingInformationData();
        const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
        let currentPaymentMethod = paymentMethodData.success
          ? paymentMethodData.value.paymentMethodName
          : none;

        let paymentMethod = currentPaymentMethod;

        if (paymentMethodType === '') {
          if (paymentMethod === none) {
            paymentMethod = paymentType.creditCard;
            handleChangeView(actionPage.UPDATE);
          }

          setPaymentMethodType(paymentMethod);
        }

        if (!paymentMethodData.success) {
          handleChangeView(actionPage.UPDATE);
        }

        const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlan,
          paymentMethodType === '' ? paymentMethod : paymentMethodType,
        );

        const selectedPlanDiscount = discountsData.success
          ? discountsData.value.find((d) => d.id.toString() === selectedDiscountId)
          : undefined;

        setDiscountsInformation({
          selectedPlanDiscount,
          discounts: discountsData.success ? discountsData.value : [],
          plan: sessionPlan.plan,
        });

        setState({
          billingCountry: billingInformationResult.value.country,
          paymentMethod: paymentMethodData.success
            ? paymentMethodData.value
            : { paymentMethodName: paymentType.creditCard },
          loading: false,
          currentPaymentMethod,
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
      paymentMethodType,
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

      handleChangeDiscount(discount ?? discountsData.value[0]);

      setDiscountsInformation({
        selectedPlanDiscount: discount ?? discountsData.value[0],
        discounts: discountsData.success ? discountsData.value : [],
        plan: sessionPlan.plan,
      });
    };

    const handleChange = (e, setFieldValue) => {
      const { value } = e.target;
      setFieldValue(fieldNames.paymentMethodName, value);
      setPaymentMethodType(value);
      getDiscountData(selectedPlan, value);
      setError(false);
      handleChangePaymentMethod(value);
    };

    const submitPaymentMethodForm = async (values) => {
      const result = await dopplerBillingUserApiClient.updatePaymentMethod({
        ...values,
        discountId: discountsInformation.selectedPlanDiscount,
        ccType: getCreditCardBrand(values.number),
        idSelectedPlan: selectedPlan,
      });

      setError(!result.success);
      if (result.success) {
        handleSaveAndContinue();
      }
    };

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);

      initialValues[fieldNames.paymentMethodName] = state.paymentMethod.paymentMethodName;

      return initialValues;
    };

    const handleDiscountChange = (discount) => {
      setDiscountsInformation({ ...discountsInformation, selectedPlanDiscount: discount });
      handleChangeDiscount(discount);
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
            {({ setFieldValue }) => (
              <Form className="dp-form-payment-method">
                <legend>{_('checkoutProcessForm.payment_method.title')}</legend>
                <fieldset>
                  <FieldGroup>
                    <FieldItem className="field-item m-b-24">
                      <PaymentMethodField
                        billingCountry={state.billingCountry}
                        currentPaymentMethod={state.currentPaymentMethod}
                        optionView={optionView}
                        handleChange={(e) => handleChange(e, setFieldValue)}
                      />
                    </FieldItem>
                    <PaymentType paymentMethodType={paymentMethodType} optionView={optionView} />
                    <FieldItem className="field-item">
                      <Discounts
                        disabled={optionView === actionPage.READONLY}
                        discountsList={discountsInformation.discounts}
                        sessionPlan={discountsInformation.plan}
                        selectedPlanDiscount={discountsInformation.selectedPlanDiscount}
                        handleChange={handleDiscountChange}
                      />
                    </FieldItem>
                    <PaymentNotes paymentMethodType={paymentMethodType} />
                    {error ? (
                      <FieldItem className="field-item">
                        <div className="dp-wrap-message dp-wrap-cancel">
                          <span className="dp-message-icon"></span>
                          <div className="dp-content-message">
                            <p>{_('checkoutProcessForm.payment_method.error')}</p>
                          </div>
                        </div>
                      </FieldItem>
                    ) : null}
                    {optionView === actionPage.UPDATE ? (
                      <FieldItem className="field-item">
                        <div className="dp-buttons-actions">
                          <SubmitButton className="dp-button button-medium primary-green">
                            {_('checkoutProcessForm.save_continue')}
                          </SubmitButton>
                        </div>
                      </FieldItem>
                    ) : null}
                  </FieldGroup>
                </fieldset>
              </Form>
            )}
          </Formik>
        )}
      </>
    );
  },
);
