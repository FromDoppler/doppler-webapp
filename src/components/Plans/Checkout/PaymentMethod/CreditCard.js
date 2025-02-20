import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Loading } from '../../../Loading/Loading';
import Cards from 'react-credit-cards';
import {
  CreditCardInputFieldItem,
  FieldGroup,
  FieldItem,
  InputFieldItem,
} from '../../../form-helpers/form-helpers';
import InputMask from 'react-input-mask';
import { actionPage } from '../Checkout';
import { fieldNames, paymentType } from './PaymentMethod';
import creditCards from '../../../../img/credit-cards.svg';
import styled from 'styled-components';
import { validateCreditCardNumber } from '../../../../validations';

export const CreditCardIcons = styled.img`
  height: 30px;
  width: 145px;
`;

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

export const CreditCard = InjectAppServices(
  ({
    dependencies: { dopplerAccountPlansApiClient, appSessionRef },
    optionView,
    paymentMethod,
  }) => {
    const intl = useIntl();
    const { setFieldValue, setValues, setFieldTouched } = useFormikContext();
    const [state, setState] = useState({ loading: true, paymentMethod: {}, readOnly: true });
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [ccMask, setCcMask] = useState(creditCardMasksByBrand.unknown);
    const [cvcMask, setCvcMask] = useState(secCodeMasksByBrand.unknown);
    const [pasted, setPasted] = useState(false);
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      if (optionView === actionPage.READONLY) {
        setState({
          paymentMethod:
            paymentMethod && Object.keys(paymentMethod).length > 1
              ? paymentMethod
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
      }
    }, [dopplerAccountPlansApiClient, appSessionRef, optionView, paymentMethod]);

    useEffect(() => {
      if (optionView === actionPage.UPDATE) {
        setValues({
          [fieldNames.name]: '',
          [fieldNames.number]: '',
          [fieldNames.expiry]: '',
          [fieldNames.cvc]: '',
          [fieldNames.paymentMethodName]: paymentType.creditCard,
        });

        setNumber('');
        setName('');
        setExpiry('');
        setCvc('');
        setState({
          loading: false,
          readOnly: false,
          paymentMethod: {},
        });
      }
    }, [dopplerAccountPlansApiClient, appSessionRef, optionView, setValues]);

    const onChangeNumber = (e) => {
      if (!pasted) {
        const { value } = e.target;
        if (value.replaceAll('-', '').trim().length <= 2) {
          setCreditCardMasks(value);
        }
        setFieldValue(fieldNames.number, value);
        setNumber(value);
      }
      setPasted(false);
    };

    const onPasteNumber = (e) => {
      setPasted(true);
      const value = e.clipboardData.getData('Text');
      setCreditCardMasks(value);
      setFieldValue(fieldNames.number, value);
      setNumber(value);
      clearCvc();
    };

    const setCreditCardMasks = (value) => {
      setCcMask(creditCardMasksByBrand[getCreditCardBrand(value)]);
      setCvcMask(secCodeMasksByBrand[getCreditCardBrand(value)]);
    };

    const clearCvc = () => {
      setFieldValue(fieldNames.cvc, '');
      setCvc('');
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
              <>
                <FieldItem className="field-item">
                  <div className="dp-considerations">
                    <p>
                      <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.availabled_credit_cards_legend" />
                    </p>
                    <CreditCardIcons
                      src={creditCards}
                      alt={_(
                        'checkoutProcessForm.payment_method.availabled_credit_cards_legend_alt_text',
                      )}
                    />
                  </div>
                </FieldItem>
                <FieldItem className="field-item field-credit-card">
                  <div className="campos">
                    <div className="dp-field-inputs">
                      <div className="campo-izq" style={{ flex: 1 }}>
                        <FieldGroup>
                          <InputMask
                            mask={ccMask}
                            value={number}
                            onChange={(e) => {
                              onChangeNumber(e, setFieldValue);
                            }}
                            onPaste={(e) => onPasteNumber(e, setFieldValue)}
                            onFocus={(e) => setFocus(e.target.name)}
                            maskChar="-"
                            onBlur={(e) => setFieldTouched(e.target.name, true)}
                          >
                            {(inputProps) => (
                              <CreditCardInputFieldItem
                                {...inputProps}
                                type="text"
                                label={`*${_('checkoutProcessForm.payment_method.credit_card')}`}
                                fieldName={fieldNames.number}
                                id={fieldNames.number}
                                required
                                checkDigitValidation={validateCreditCardNumber}
                                validate={true}
                                withSubmitCount={false}
                              />
                            )}
                          </InputMask>
                        </FieldGroup>
                      </div>
                      <div className="dp--expiry">
                        <FieldGroup>
                          <InputMask
                            mask="99/9999"
                            maskChar="-"
                            value={expiry}
                            onChange={(e) => {
                              setFieldValue(fieldNames.expiry, e.target.value);
                              setExpiry(e.target.value);
                            }}
                            onFocus={(e) => setFocus(e.target.name)}
                            onBlur={(e) => setFieldTouched(e.target.name, true)}
                            withExpiryDateValidation
                          >
                            {(inputProps) => (
                              <InputFieldItem
                                {...inputProps}
                                type="text"
                                label={`*${_(
                                  'checkoutProcessForm.payment_method.expiration_date',
                                )}`}
                                fieldName={fieldNames.expiry}
                                id="expiry"
                                required
                                withSubmitCount={false}
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
                            id={fieldNames.name}
                            label={`*${_('checkoutProcessForm.payment_method.holder_name')}`}
                            required
                            onChange={(e) => {
                              setFieldValue(fieldNames.name, e.target.value);
                              setName(e.target.value);
                            }}
                            onFocus={(e) => setFocus(e.target.name)}
                            value={name}
                            placeholder=""
                            withSubmitCount={false}
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
                            onBlur={(e) => setFieldTouched(e.target.name, true)}
                          >
                            {(inputProps) => (
                              <InputFieldItem
                                {...inputProps}
                                type="text"
                                label={`*${_('checkoutProcessForm.payment_method.security_code')}`}
                                fieldName={fieldNames.cvc}
                                id={fieldNames.cvc}
                                required
                                withSubmitCount={false}
                                value={cvc}
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
              </>
            )}
          </FieldGroup>
        )}
      </>
    );
  },
);
