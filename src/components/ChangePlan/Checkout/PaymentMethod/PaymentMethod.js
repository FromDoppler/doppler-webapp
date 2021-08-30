import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Form, Formik } from 'formik';
import { Loading } from '../../../Loading/Loading';
import Cards from 'react-credit-cards';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { getFormInitialValues, extractParameter } from '../../../../utils';
import { FieldGroup, FieldItem } from '../../../form-helpers/form-helpers';
import { Discounts } from '../Discounts/Discounts';

const fieldNames = {
  paymentMethodName: 'paymentMethodName',
};

const paymentType = {
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

const creditCardType = {
  mastercard: 'Mastercard',
  visa: 'Visa',
  amex: 'American Express',
};

const amexDescription = 'amex';

const getCreditCardBrand = (ccType) => {
  // check for American Express
  if (ccType === creditCardType.amex) {
    return amexDescription;
  }

  return ccType;
};

export const PaymentMethod = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    showTitle,
  }) => {
    const location = useLocation();
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;
    const selectedDiscountId = extractParameter(location, queryString.parse, 'discountId') || 0;
    const intl = useIntl();
    const [state, setState] = useState({ loading: true });
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        const sessionPlan = appSessionRef.current.userData.user;
        const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
        const paymentMethod = paymentMethodData.success
          ? paymentMethodData.value.paymentMethodName
          : paymentType.creditCard;
        const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlan,
          paymentMethod,
        );

        const selectedPlanDiscount = discountsData.success
          ? discountsData.value.find((d) => d.id.toString() === selectedDiscountId)
          : undefined;

        setState({
          readOnly: true,
          paymentMethod: paymentMethodData.success
            ? paymentMethodData.value
            : { paymentMethodName: paymentType.creditCard },
          sessionPlan,
          discounts: discountsData.success ? discountsData.value : [],
          loading: false,
          selectedPlanDiscount,
        });
      };
      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      appSessionRef,
      selectedPlan,
      selectedDiscountId,
    ]);

    const handleChange = (e) => {
      setState({
        selectedOption: e.target.value,
      });
    };

    return (
      <>
        {showTitle ? (
          <div className="dp-accordion-thumb">{_('checkoutProcessForm.payment_method.title')}</div>
        ) : null}
        {state.loading ? (
          <Loading page />
        ) : (
          <Formik initialValues={getFormInitialValues(fieldNames)}>
            <Form className="dp-form-payment-method">
              <legend>{_('checkoutProcessForm.payment_method.title')}</legend>
              <fieldset>
                <FieldGroup>
                  <FieldItem className="field-item m-b-24">
                    <ul className="dp-radio-input">
                      {paymentMethods.map((paymentMethod) => (
                        <li key={paymentMethod.value}>
                          <div className="dp-volume-option">
                            <label>
                              <input
                                aria-label={paymentMethod.description}
                                type="radio"
                                name="paymentMethod"
                                disabled={
                                  state.readOnly &&
                                  state.paymentMethod.paymentMethodName !== paymentMethod.value
                                }
                                value={paymentMethod.value}
                                checked={
                                  state.paymentMethod.paymentMethodName === paymentMethod.value
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
                      ))}
                    </ul>
                  </FieldItem>
                  {state.readOnly &&
                  state.paymentMethod.paymentMethodName === paymentType.creditCard ? (
                    <li className="field-item" style={{ display: 'block' }}>
                      <Cards
                        cvc={state.paymentMethod.ccSecurityCode ?? ''}
                        expiry={state.paymentMethod.ccExpiryDate ?? ''}
                        name={state.paymentMethod.ccHolderName ?? ''}
                        number={state.paymentMethod.ccNumber ?? ''}
                        issuer={getCreditCardBrand(state.paymentMethod.ccType ?? '')}
                        preview={true}
                        locale={{ valid: _('checkoutProcessForm.payment_method.valid_thru') }}
                      />
                    </li>
                  ) : null}
                  <FieldItem className="field-item">
                    {state.discounts?.length ? (
                      <Discounts
                        disabled={state.readOnly}
                        discountsList={state.discounts}
                        sessionPlan={state.sessionPlan.plan}
                        selectedPlanDiscount={state.selectedPlanDiscount}
                      />
                    ) : null}
                  </FieldItem>
                </FieldGroup>
              </fieldset>
            </Form>
          </Formik>
        )}
      </>
    );
  },
);
