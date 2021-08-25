import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Form, Formik } from 'formik';
import { Loading } from '../../../Loading/Loading';
import Cards from 'react-credit-cards';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import useTimeout from '../../../../hooks/useTimeout';
import { FieldGroup, FieldItem } from '../../../form-helpers/form-helpers';
import { Discounts } from '../Discounts/Discounts';
import { getFormInitialValues } from '../../../../utils';

const fieldNames = {
  paymentMethodName: 'paymentMethodName',
};

const paymentType = {
  MercadoPago: 'MP',
};

export const PaymentMethod = InjectAppServices(({ dependencies: { appSessionRef }, showTitle }) => {
  const intl = useIntl();
  const [state, setState] = useState({ loading: true });
  const createTimeout = useTimeout();

  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      const sessionPlan = appSessionRef.current.userData.user;
      const discounts = fakeAccountPlanDiscounts;

      //TODO: Timeout to simulate the loading, I will remove it when the integration with tha APIs are done
      createTimeout(
        () =>
          setState({
            readOnly: true,
            paymentMethod: fakePaymentMethodInformation,
            sessionPlan,
            discounts,
            loading: false,
          }),
        300,
      );
    };
    fetchData();
  }, [createTimeout, appSessionRef]);

  const paymentMethods = [
    {
      id: 'creditCard',
      value: 'CC',
      description: _('checkoutProcessForm.payment_method_credit_card_method'),
    },
    {
      id: 'transfer',
      value: 'TRANSF',
      description: _('checkoutProcessForm.payment_method_transfer_method'),
    },
    {
      id: 'mercadoPago',
      value: 'MP',
      description: _('checkoutProcessForm.payment_method_mercado_pago_method'),
    },
  ];

  const handleChange = (e) => {
    setState({
      selectedOption: e.target.value,
    });
  };

  return (
    <>
      {showTitle ? (
        <div className="dp-accordion-thumb">{_('checkoutProcessForm.payment_method_title')}</div>
      ) : null}
      {state.loading ? (
        <Loading page />
      ) : (
        <Formik initialValues={getFormInitialValues(fieldNames)}>
          <Form className="dp-form-payment-method">
            <legend>{_('checkoutProcessForm.payment_method_title')}</legend>
            <fieldset>
              <FieldGroup>
                <FieldItem className="field-item m-b-24">
                  <ul className="dp-radio-input">
                    {paymentMethods.map((paymentMethod) => (
                      <li key={paymentMethod.id}>
                        <div className="dp-volume-option">
                          <label>
                            <input
                              id={paymentMethod.id}
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
                            {paymentMethod.value !== paymentType.MercadoPago ? (
                              <span>{paymentMethod.description}</span>
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
                {state.readOnly ? (
                  <li className="field-item" style={{ display: 'block' }}>
                    <Cards
                      cvc={state.paymentMethod.ccSecurityCode}
                      expiry={state.paymentMethod.expiryDate}
                      name={state.paymentMethod.ccHolderName}
                      number={state.paymentMethod.ccNumber}
                      issuer={state.paymentMethod.ccType}
                      preview={true}
                      locale={{ valid: _('checkoutProcessForm.payment_method_valid_thru') }}
                    />
                  </li>
                ) : null}
                <FieldItem className="field-item">
                  <Discounts
                    disabled={state.readOnly}
                    discountsList={state.discounts}
                    sessionPlan={state.sessionPlan.plan}
                    title={'Tipo de renovación:'}
                  />
                </FieldItem>
              </FieldGroup>
            </fieldset>
          </Form>
        </Formik>
      )}
    </>
  );
});
