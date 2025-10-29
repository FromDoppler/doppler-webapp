import React, { useEffect, useState, useRef } from 'react';
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

const loadEprotectScript = () => {
  return new Promise((resolve, reject) => {
    if (window.eProtect) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://request.eprotect.vantivprelive.com/eProtect/eProtect-api3.js';
    script.type = 'text/javascript';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load eProtect script'));
    document.head.appendChild(script);
  });
};

export const CreditCard = InjectAppServices(
  ({
    dependencies: { dopplerAccountPlansApiClient, appSessionRef },
    optionView,
    paymentMethod,
    setHandleSubmit,
  }) => {
    const intl = useIntl();
    const { setFieldValue, setValues, setFieldTouched, values } = useFormikContext();
    const [state, setState] = useState({ loading: true, paymentMethod: {}, readOnly: true });
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [ccMask, setCcMask] = useState(creditCardMasksByBrand.unknown);
    const [cvcMask, setCvcMask] = useState(secCodeMasksByBrand.unknown);
    const [pasted, setPasted] = useState(false);
    // const [isProcessing, setIsProcessing] = useState(false);
    const scriptLoaded = useRef(false);
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      if (!scriptLoaded.current) {
        loadEprotectScript()
          .then(() => {
            scriptLoaded.current = true;
          })
          .catch((error) => {
            console.error('Error loading eProtect script:', error);
          });
      }
    }, []);

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

    const setEprotectResponseFields = (response) => {
      const fieldsToUpdate = {
        'response$paypageRegistrationId': response.paypageRegistrationId || '',
        'response$checkoutId': response.checkoutId || '',
        'response$bin': response.bin || '',
        'response$code': response.response || '',
        'response$message': response.message || '',
        'response$responseTime': response.responseTime || '',
        'response$type': response.type || '',
        'response$vantivTxnId': response.vantivTxnId || '',
        'response$firstSix': response.firstSix || '',
        'response$lastFour': response.lastFour || '',
        'response$accountRangeId': response.accountRangeId || '',
      };

      Object.entries(fieldsToUpdate).forEach(([fieldName, value]) => {
        setFieldValue(fieldName, value);
      });
    };

    const timeoutOnEprotect = () => {
      console.error("Timeout al intentar procesar con eProtect.");
      // setIsProcessing(false);
    };

    const onErrorAfterEprotect = (response) => {
      setEprotectResponseFields(response);
      // setIsProcessing(false);
      console.error("Error: " + (response.message || 'Unknown error'));
    };

    const submitAfterEprotect = (response) => {
      setEprotectResponseFields(response);
      // setIsProcessing(false);
    };

    const handleSubmit = async () => {
      if (!number || !name || !expiry || !cvc) {
        alert("Por favor complete todos los campos requeridos");
        return Promise.reject(new Error("Missing required fields"));
      }

      // setIsProcessing(true);

      return new Promise((resolve, reject) => {
        const wrappedSubmitAfterEprotect = (response) => {
          submitAfterEprotect(response);
          resolve(response);
        };

        const wrappedOnErrorAfterEprotect = (response) => {
          onErrorAfterEprotect(response);
          reject(response);
        };

        const wrappedTimeoutOnEprotect = () => {
          timeoutOnEprotect();
          reject(new Error("Timeout eProtect"));
        };

        try {
          if (!window.eProtect) {
            loadEprotectScript().then(() => {
              executeEprotectCall(wrappedSubmitAfterEprotect, wrappedOnErrorAfterEprotect, wrappedTimeoutOnEprotect);
            }).catch((error) => {
              console.error('Error loading eProtect script:', error);
              const errorResponse = {
                response: "999",
                message: "Error loading eProtect script: " + error.message
              };
              onErrorAfterEprotect(errorResponse);
              reject(errorResponse);
            });
          } else {
            executeEprotectCall(wrappedSubmitAfterEprotect, wrappedOnErrorAfterEprotect, wrappedTimeoutOnEprotect);
          }
        } catch (error) {
          console.error('Error with eProtect:', error);
          const errorResponse = {
            response: "999",
            message: "Error initializing eProtect: " + error.message
          };
          onErrorAfterEprotect(errorResponse);
          reject(errorResponse);
        }
      });
    };

    const executeEprotectCall = (onSuccess, onError, onTimeout) => {
      const eProtectRequest = {
        "paypageId": "a2y4o6m8k0",
        "reportGroup": "*merchant1500",
        "orderId": `order_${Date.now()}`,
        "id": `merchantTxn_${Date.now()}`,
        "url": "https://request.eprotect.vantivprelive.com",
        "minPanLength": 16,
        "checkoutIdMode": true
      };

      const formFields = {
        "accountNum": document.getElementById(fieldNames.number),
        "cvv": document.getElementById(fieldNames.cvc),
        "cvv2": document.getElementById(fieldNames.cvc),
        "paypageRegistrationId":document.getElementById('response$paypageRegistrationId'),
        "checkoutId":document.getElementById('response$checkoutId'),
        "bin"  :document.getElementById('response$bin')
      };

      new window.eProtect().sendToEprotect(
        eProtectRequest,
        formFields,
        onSuccess,
        onError,
        onTimeout,
        15000
      );
    };

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

    useEffect(() => {
      setHandleSubmit(() => handleSubmit);
    }, [number, name, expiry, cvc, setHandleSubmit, handleSubmit]);

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
        {/* Hidden Inputs for eProtect */}
        <input type="hidden" id="response$paypageRegistrationId" name="response$paypageRegistrationId" value={values.response$paypageRegistrationId || ''} />
        <input type="hidden" id="response$checkoutId" name="response$checkoutId" value={values.response$checkoutId || ''} />
        <input type="hidden" id="response$bin" name="response$bin" value={values.response$bin || ''} />
        <input type="hidden" id="response$code" name="response$code" value={values.response$code || ''} />
        <input type="hidden" id="response$message" name="response$message" value={values.response$message || ''} />
        <input type="hidden" id="response$responseTime" name="response$responseTime" value={values.response$responseTime || ''} />
        <input type="hidden" id="response$type" name="response$type" value={values.response$type || ''} />
        <input type="hidden" id="response$vantivTxnId" name="response$vantivTxnId" value={values.response$vantivTxnId || ''} />
        <input type="hidden" id="response$firstSix" name="response$firstSix" value={values.response$firstSix || ''} />
        <input type="hidden" id="response$lastFour" name="response$lastFour" value={values.response$lastFour || ''} />
        <input type="hidden" id="response$accountRangeId" name="response$accountRangeId" value={values.response$accountRangeId || ''} />
        <input type="hidden" id="request$reportGroup" name="request$reportGroup" value="*merchant1500"/>
      </>
    );
  },
);
