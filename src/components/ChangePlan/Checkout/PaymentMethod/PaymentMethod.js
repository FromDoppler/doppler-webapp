import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Form, Formik, Field } from 'formik';
import { Loading } from '../../../Loading/Loading';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { Discounts } from '../../PlanCalculator/Discounts/Discounts';
import useTimeout from '../../../../hooks/useTimeout';

//TODO: Remove these styles when the UI Library has been update with this section
import * as S from './PaymentMethod.styles';

const paymentMethodOptionStyle = {
  border: '0px',
  marginLeft: '0px',
};

const cardStyle = {
  border: '0px',
  marginLeft: '0px',
  width: '40%',
};

const paymentMethodOptionsContainerStyle = {
  background: '#FFFFFF',
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

      //TODO: Timeout to simulate the loading, I will remove it when the integration with tha APIs are done.
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
        <Formik>
          <Form className="dp-wrapper-form-plans">
            <legend>{_('checkoutProcessForm.payment_method_title')}</legend>
            <fieldset>
              <div className="dp-wrapper-volume-options" id="checkbox-group">
                <Field name="paymentMethod">
                  {() => (
                    <ul className="dp-volume-per-month" style={paymentMethodOptionsContainerStyle}>
                      {paymentMethods.map((paymentMethod) => (
                        <li key={paymentMethod.id} style={paymentMethodOptionStyle}>
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
                              <span>{paymentMethod.description}</span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Field>
              </div>
              {state.readOnly ? (
                <div style={cardStyle}>
                  <Cards
                    cvc={state.paymentMethod.ccSecurityCode}
                    expiry={state.paymentMethod.expiryDate}
                    name={state.paymentMethod.ccHolderName}
                    number={state.paymentMethod.ccNumber}
                    issuer={state.paymentMethod.ccType}
                    preview={true}
                    locale={{ valid: _('checkoutProcessForm.payment_method_valid_thru') }}
                  />
                </div>
              ) : null}
              {state.discounts?.length ? (
                <>
                  <S.DiscountsStyle>
                    <Discounts
                      disabled={state.readOnly}
                      discountsList={state.discounts}
                      sessionPlan={state.sessionPlan.plan}
                    />
                  </S.DiscountsStyle>
                </>
              ) : (
                <></>
              )}
            </fieldset>
          </Form>
        </Formik>
      )}
    </>
  );
});
