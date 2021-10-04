import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Loading } from '../../../Loading/Loading';
import Cards from 'react-credit-cards';
import { FieldGroup, FieldItem, InputFieldItem } from '../../../form-helpers/form-helpers';
import InputMask from 'react-input-mask';
import { actionPage } from '../Checkout';
import { fieldNames, paymentType } from './PaymentMethod';

const creditCardType = {
  mastercard: 'Mastercard',
  visa: 'Visa',
  amex: 'American Express',
};

const amexDescription = 'amex';

const creditCardMasksByBrand = {
  mastercard: '9999 9999 9999 9999',
  visa: '9999 9999 9999 9999',
  amex: '9999 999999 99999',
  unknown: '9999 9999 9999 9999',
};

const secCodeMasksByBrand = {
  mastercard: '999',
  visa: '999',
  amex: '9999',
  unknown: '999',
};

const getCreditCardIssuer = (ccType) => {
  // check for American Express
  if (ccType === creditCardType.amex) {
    return amexDescription;
  }

  return ccType;
};

export const getCreditCardBrand = (creditCardNumber) => {
  // first check for MasterCard
  if (/^5[1-5]/.test(creditCardNumber)) {
    return 'mastercard';
  }
  // then check for Visa
  else if (/^4/.test(creditCardNumber)) {
    return 'visa';
  }
  // then check for AmEx
  else if (/^3[47]/.test(creditCardNumber)) {
    return 'amex';
  }
  return 'unknown';
};

export const CreditCard = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    optionView,
  }) => {
    const intl = useIntl();
    const { setFieldValue, setValues } = useFormikContext();
    const [state, setState] = useState({ loading: true, paymentMethod: {}, readOnly: true });
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [ccMask, setCcMask] = useState(creditCardMasksByBrand.unknown);
    const [cvcMask, setCvcMask] = useState(secCodeMasksByBrand.unknown);
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const initializeDefaultValues = () => {
        setValues({
          [fieldNames.name]: '',
          [fieldNames.number]: '',
          [fieldNames.expiry]: '',
          [fieldNames.cvc]: '',
          [fieldNames.paymentMethodName]: paymentType.creditCard,
        });
      };

      const fetchData = async () => {
        if (optionView === actionPage.READONLY) {
          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
          setState({
            paymentMethod: paymentMethodData.success
              ? paymentMethodData.value
              : {
                  ccSecurityCode: '',
                  ccExpiryDate: '',
                  ccHolderName: '',
                  ccNumber: '',
                  ccType: '',
                },
            loading: false,
            readOnly: true,
          });
        } else {
          initializeDefaultValues();
          setState({
            loading: false,
            readOnly: false,
            paymentMethod: {},
          });
        }
      };

      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      appSessionRef,
      optionView,
      setFieldValue,
      setValues,
    ]);

    const onChangeNumber = (e) => {
      const { value } = e.target;
      setFieldValue(fieldNames.number, value);
      setNumber(value);
      if (value.replaceAll('-', '').trim().length <= 2) {
        setCcMask(creditCardMasksByBrand[getCreditCardBrand(value)]);
        setCvcMask(secCodeMasksByBrand[getCreditCardBrand(value)]);
      }
    };

    return (
      <>
        {state.loading ? (
          <Loading page />
        ) : (
          <FieldGroup>
            {state.readOnly ? (
              <li className="field-item" style={{ display: 'block' }}>
                <Cards
                  cvc={state.paymentMethod.ccSecurityCode}
                  expiry={state.paymentMethod.ccExpiryDate}
                  name={state.paymentMethod.ccHolderName}
                  number={state.paymentMethod.ccNumber}
                  issuer={getCreditCardIssuer(state.paymentMethod.ccType)}
                  preview={true}
                  placeholders={{
                    name: _('checkoutProcessForm.payment_method.placeholder_holder_name'),
                  }}
                  locale={{ valid: _('checkoutProcessForm.payment_method.valid_thru') }}
                />
              </li>
            ) : (
              <FieldItem className="field-item field-credit-card">
                <div className="campos">
                  <div className="dp-field-inputs">
                    <div className="campo-izq" style={{ flex: 1 }}>
                      <FieldGroup>
                        <InputMask
                          mask={ccMask}
                          value={number}
                          onChange={(e) => onChangeNumber(e, setFieldValue)}
                          onFocus={(e) => setFocus(e.target.name)}
                          maskChar="-"
                        >
                          {(inputProps) => (
                            <InputFieldItem
                              {...inputProps}
                              type="text"
                              label={`*${_('checkoutProcessForm.payment_method.credit_card')}`}
                              fieldName={fieldNames.number}
                              id="number"
                              required
                            />
                          )}
                        </InputMask>
                      </FieldGroup>
                    </div>
                    <div className="dp--expiry">
                      <FieldGroup>
                        <InputMask
                          mask="99/99"
                          maskChar="-"
                          value={expiry}
                          onChange={(e) => {
                            setFieldValue(fieldNames.expiry, e.target.value);
                            setExpiry(e.target.value);
                          }}
                          onFocus={(e) => setFocus(e.target.name)}
                        >
                          {(inputProps) => (
                            <InputFieldItem
                              {...inputProps}
                              type="text"
                              label={`*${_('checkoutProcessForm.payment_method.expiration_date')}`}
                              fieldName={fieldNames.expiry}
                              id="expiry"
                              required
                            />
                          )}
                        </InputMask>
                      </FieldGroup>
                    </div>
                  </div>
                  <div className="dp-field-inputs">
                    <div className="campo-izq" style={{ flex: 1 }}>
                      <FieldGroup>
                        <InputFieldItem
                          type="text"
                          fieldName={fieldNames.name}
                          id="name"
                          label={`*${_('checkoutProcessForm.payment_method.holder_name')}`}
                          required
                          onChange={(e) => {
                            setFieldValue('name', e.target.value);
                            setName(e.target.value);
                          }}
                          onFocus={(e) => setFocus(e.target.name)}
                          value={name}
                          placeholder=""
                        />
                      </FieldGroup>
                    </div>
                    <div className="dp--cvv">
                      <FieldGroup>
                        <InputMask
                          mask={cvcMask}
                          maskChar="-"
                          value={cvc}
                          onChange={(e) => {
                            setFieldValue(fieldNames.cvc, e.target.value);
                            setCvc(e.target.value);
                          }}
                          onFocus={(e) => setFocus(e.target.name)}
                        >
                          {(inputProps) => (
                            <InputFieldItem
                              {...inputProps}
                              type="tel"
                              label={`*${_('checkoutProcessForm.payment_method.security_code')}`}
                              fieldName={fieldNames.cvc}
                              id="cvc"
                              required
                            />
                          )}
                        </InputMask>
                      </FieldGroup>
                    </div>
                  </div>
                </div>
                <div className="tarjeta">
                  <div className="dp-credit-card">
                    <Cards
                      cvc={cvc}
                      expiry={expiry}
                      focused={focus}
                      name={name}
                      number={number}
                      acceptedCards={['visa', 'mastercard', 'amex']}
                      placeholders={{
                        name: _('checkoutProcessForm.payment_method.placeholder_holder_name'),
                      }}
                      locale={{ valid: _('checkoutProcessForm.payment_method.valid_thru') }}
                    />
                  </div>
                </div>
              </FieldItem>
            )}
          </FieldGroup>
        )}
      </>
    );
  },
);
