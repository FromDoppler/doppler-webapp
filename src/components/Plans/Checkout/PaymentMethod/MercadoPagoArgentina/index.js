import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Loading } from '../../../../Loading/Loading';
import Cards from 'react-credit-cards';
import {
  CuitFieldItem,
  FieldGroup,
  FieldItem,
  InputFieldItem,
} from '../../../../form-helpers/form-helpers';
import InputMask from 'react-input-mask';
import { actionPage } from '../../Checkout';
import { fieldNames } from '../PaymentMethod';
import creditCards from '../../../../../img/credit-cards.svg';
import styled from 'styled-components';
import { paymentType } from '../PaymentMethod';
import { getCreditCardBrand } from '../CreditCard';
import { validateDni } from '../../../../../validations';

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

export const MercadoPagoArgentina = ({ optionView, paymentMethod }) => {
  const intl = useIntl();
  const { setFieldValue, setValues, values } = useFormikContext();
  const [state, setState] = useState({ loading: true, paymentMethod: {}, readOnly: true });
  const [focus, setFocus] = useState('');
  const [ccMask, setCcMask] = useState(creditCardMasksByBrand.unknown);
  const [cvcMask, setCvcMask] = useState(secCodeMasksByBrand.unknown);
  const [pasted, setPasted] = useState(false);
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const initializeDefaultValues = () => {
      setValues({
        [fieldNames.name]: '',
        [fieldNames.number]: '',
        [fieldNames.expiry]: '',
        [fieldNames.cvc]: '',
        [fieldNames.identificationNumber]: '',
        [fieldNames.paymentMethodName]: paymentType.mercadoPago,
      });
    };

    if (optionView === actionPage.READONLY) {
      setState({
        paymentMethod: paymentMethod
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
    } else {
      initializeDefaultValues();
      setState({
        loading: false,
        readOnly: false,
        paymentMethod: {},
      });
    }
  }, [optionView, setFieldValue, setValues, paymentMethod]);

  const onChangeNumber = (e) => {
    if (!pasted) {
      const { value } = e.target;
      if (value.replaceAll('-', '').trim().length <= 2) {
        setCreditCardMasks(value);
      }
      setFieldValue(fieldNames.number, value);
      clearCvc();
    }
    setPasted(false);
  };

  const onPasteNumber = (e) => {
    setPasted(true);
    const value = e.clipboardData.getData('Text');
    setCreditCardMasks(value);
    setFieldValue(fieldNames.number, value);
    clearCvc();
  };

  const setCreditCardMasks = (value) => {
    setCcMask(creditCardMasksByBrand[getCreditCardBrand(value)]);
    setCvcMask(secCodeMasksByBrand[getCreditCardBrand(value)]);
  };

  const clearCvc = () => {
    setFieldValue(fieldNames.cvc, '');
  };

  const onFocus = (e) => {
    setFocus(e.target.name);
  };

  if (state.loading) {
    return <Loading page />;
  }

  if (state.readOnly) {
    return (
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
    );
  }

  const {
    [fieldNames.number]: number,
    [fieldNames.expiry]: expiry,
    [fieldNames.name]: name,
    [fieldNames.cvc]: cvc,
  } = values;

  return (
    <FieldGroup>
      <FieldItem className="field-item">
        <div className="dp-considerations">
          <p>
            <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.availabled_credit_cards_legend" />
          </p>
          <CreditCardIcons
            src={creditCards}
            alt={_('checkoutProcessForm.payment_method.availabled_credit_cards_legend_alt_text')}
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
                  onChange={onChangeNumber}
                  onPaste={onPasteNumber}
                  onFocus={onFocus}
                  maskChar="-"
                >
                  {(inputProps) => (
                    <InputFieldItem
                      {...inputProps}
                      type="text"
                      label={`*${_('checkoutProcessForm.payment_method.credit_card')}`}
                      fieldName={fieldNames.number}
                      id={fieldNames.number}
                      required
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
                  }}
                  onFocus={onFocus}
                >
                  {(inputProps) => (
                    <InputFieldItem
                      {...inputProps}
                      type="text"
                      label={`*${_('checkoutProcessForm.payment_method.expiration_date')}`}
                      fieldName={fieldNames.expiry}
                      id={fieldNames.expiry}
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
                  id={fieldNames.name}
                  label={`*${_('checkoutProcessForm.payment_method.holder_name')}`}
                  required
                  onChange={(e) => {
                    setFieldValue(fieldNames.name, e.target.value);
                  }}
                  onFocus={onFocus}
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
                  }}
                  onFocus={onFocus}
                >
                  {(inputProps) => (
                    <InputFieldItem
                      {...inputProps}
                      type="text"
                      label={`*${_('checkoutProcessForm.payment_method.security_code')}`}
                      fieldName={fieldNames.cvc}
                      id={fieldNames.cvc}
                      required
                    />
                  )}
                </InputMask>
              </FieldGroup>
            </div>
          </div>
          <div className="dp-field-inputs">
            <div className="dp--expiry">
              <FieldGroup>
                <CuitFieldItem
                  type="number"
                  aria-label="identificationNumber"
                  fieldName={fieldNames.identificationNumber}
                  id={fieldNames.identificationNumber}
                  label={`*${_('checkoutProcessForm.payment_method.dni')}`}
                  required
                  validate={true}
                  validateIdentificationNumber={validateDni}
                />
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
    </FieldGroup>
  );
};
