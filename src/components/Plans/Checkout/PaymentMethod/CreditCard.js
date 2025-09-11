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
import WithoutMC from '../../../../img/credit-cards.png';
import styled from 'styled-components';
import { validateCreditCardNumber } from '../../../../validations';

export const CreditCardIcons = styled.img`
  height: 30px;
  width: 145px;
`;

export const CreditCardIconsWithoutMC = styled.img`
  height: 30px;
  width: 100px;
`;

const CreditCardContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardPreviewSection = styled.div`
  flex: 0 0 auto;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: 30px;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FormColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const ResponseSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
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
  if (ccType === creditCardType.amex) {
    return amexDescription;
  }
  return ccType;
};

export const getCreditCardBrand = (creditCardNumber) => {
  if (/^5[1-5]/.test(creditCardNumber)) {
    return 'mastercard';
  } else if (/^4/.test(creditCardNumber)) {
    return 'visa';
  } else if (/^3[47]/.test(creditCardNumber)) {
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
    onSubmit,
  }) => {
    const intl = useIntl();
    const { setFieldValue, setValues, setFieldTouched, values } = useFormikContext();
    const [state, setState] = useState({ 
      loading: true, 
      paymentMethod: {}, 
      readOnly: true 
    });
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [ccMask, setCcMask] = useState(creditCardMasksByBrand.unknown);
    const [cvcMask, setCvcMask] = useState(secCodeMasksByBrand.unknown);
    const [pasted, setPasted] = useState(false);
    const [useMock, setUseMock] = useState(true);
    const [eProtectResponse, setEProtectResponse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const scriptLoaded = useRef(false);

    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      if (!scriptLoaded.current && !useMock) {
        loadEprotectScript()
          .then(() => {
            scriptLoaded.current = true;
          })
          .catch((error) => {
            console.error('Error loading eProtect script:', error);
            setUseMock(true);
          });
      }
    }, [useMock]);

    useEffect(() => {
      if (optionView === actionPage.READONLY) {
        setState({
          paymentMethod:
            paymentMethod && Object.keys(paymentMethod).length > 0
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
    }, [optionView, paymentMethod]);

    useEffect(() => {
      if (optionView === actionPage.UPDATE) {
        const initialValues = {
          [fieldNames.name]: '',
          [fieldNames.number]: '',
          [fieldNames.expiry]: '',
          [fieldNames.cvc]: '',
          [fieldNames.paymentMethodName]: paymentType.creditCard,
        };

        setValues(initialValues);
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
    }, [optionView, setValues]);

    const toggleMode = () => {
      setUseMock(!useMock);
    };

    const setEprotectResponseFields = (response) => {
      const fieldsToUpdate = {
        'response$paypageRegistrationId': response.paypageRegistrationId || '',
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

    const submitAfterEprotect = (response) => {
      setEprotectResponseFields(response);
      setEProtectResponse(response);
      setIsProcessing(false);
      
      if (onSubmit) {
        onSubmit(response);
      }
    };

    const timeoutOnEprotect = () => {
      alert("Timeout al intentar procesar con eProtect.");
      setIsProcessing(false);
    };

    const onErrorAfterEprotect = (response) => {
      setEprotectResponseFields(response);
      setEProtectResponse(response);
      setIsProcessing(false);
      alert("Error: " + (response.message || 'Unknown error'));
    };

    const handleSubmit = async () => {
      if (!number || !name || !expiry || !cvc) {
        alert("Por favor complete todos los campos requeridos");
        return;
      }

      setIsProcessing(true);
      setEProtectResponse(null);

      if (useMock) {
        setTimeout(() => {
          const mockResponse = {
            response: "000",
            message: "Approved - Mock",
            responseTime: new Date().toISOString(),
            vantivTxnId: "MOCK123456",
            type: "MOCK",
            accountRangeId: "12345",
            firstSix: number.replace(/\D/g, '').substring(0, 6),
            lastFour: number.replace(/\D/g, '').slice(-4),
            paypageRegistrationId: "mock-paypage-id-123",
            bin: number.replace(/\D/g, '').substring(0, 6)
          };
          submitAfterEprotect(mockResponse);
        }, 1000);
      } else {
        try {
          if (!window.eProtect) {
            await loadEprotectScript();
          }

          const eProtectRequest = {
            "paypageId": "a2y4o6m8k0",
            "reportGroup": "*merchant1500",
            "orderId": `order_${Date.now()}`,
            "id": `merchantTxn_${Date.now()}`,
            "url": "https://request.eprotect.vantivprelive.com",
            "minPanLength": 16
          };

          new window.eProtect().sendToEprotect(
            eProtectRequest,
            {
              "accountNum": number.replace(/\D/g, ''),
              "cvv": cvc,
            },
            submitAfterEprotect,
            onErrorAfterEprotect,
            timeoutOnEprotect,
            15000
          );
        } catch (error) {
          console.error('Error with eProtect:', error);
          onErrorAfterEprotect({
            response: "999",
            message: "Error initializing eProtect: " + error.message
          });
        }
      }
    };

    const onChangeNumber = (e) => {
      if (!pasted) {
        const { value } = e.target;
        const cleanValue = value.replace(/\D/g, '');
        
        if (cleanValue.length <= 6) {
          setCreditCardMasks(cleanValue);
        }
        setFieldValue(fieldNames.number, value);
        setNumber(value);
      }
      setPasted(false);
    };

    const onPasteNumber = (e) => {
      setPasted(true);
      const pastedValue = e.clipboardData.getData('Text');
      const cleanValue = pastedValue.replace(/\D/g, '');
      
      setCreditCardMasks(cleanValue);
      setFieldValue(fieldNames.number, pastedValue);
      setNumber(pastedValue);
      setFieldValue(fieldNames.cvc, '');
      setCvc('');
    };

    const setCreditCardMasks = (value) => {
      const brand = getCreditCardBrand(value);
      setCcMask(creditCardMasksByBrand[brand] || creditCardMasksByBrand.unknown);
      setCvcMask(secCodeMasksByBrand[brand] || secCodeMasksByBrand.unknown);
    };

    if (state.loading) {
      return <Loading page />;
    }

    return (
      <CreditCardContainer>
        {!state.readOnly && (
          <ModeToggle>
            <button 
              type="button" 
              onClick={toggleMode}
              className="dp-button button-medium secondary-green"
            >
              Cambiar modo
            </button>
            <span>Modo actual: {useMock ? "MOCK" : "REAL"}</span>
          </ModeToggle>
        )}

        {state.readOnly ? (
          <div className="readonly-card">
            <Cards
              cvc={state.paymentMethod.ccSecurityCode || ''}
              expiry={state.paymentMethod.ccExpiryDate || ''}
              name={state.paymentMethod.ccHolderName || ''}
              number={state.paymentMethod.ccNumber || ''}
              issuer={getCreditCardIssuer(state.paymentMethod.ccType)}
              preview={true}
              placeholders={{
                name: _('checkoutProcessForm.payment_method.placeholder_holder_name'),
              }}
              locale={{ valid: _('checkoutProcessForm.payment_method.valid_thru') }}
            />
          </div>
        ) : (
          <>
            <div className="dp-considerations">
              <p>
                <FormatMessageWithBoldWords id="checkoutProcessForm.payment_method.availabled_credit_cards_legend" />
              </p>
              <CreditCardIconsWithoutMC
                src={WithoutMC}
                alt={_(
                  'checkoutProcessForm.payment_method.availabled_credit_cards_legend_alt_text',
                )}
              />
            </div>

            <FormContainer>
              <FormSection>
                <FormRow>
                  <FormColumn>
                    <FieldGroup>
                      <InputMask
                        mask={ccMask}
                        value={number}
                        onChange={onChangeNumber}
                        onPaste={onPasteNumber}
                        onFocus={(e) => setFocus('number')}
                        maskChar=" "
                        onBlur={(e) => setFieldTouched(fieldNames.number, true)}
                      >
                        {(inputProps) => (
                          <CreditCardInputFieldItem
                            {...inputProps}
                            type="text"
                            label={`*${_('checkoutProcessForm.payment_method.credit_card')}`}
                            fieldName={fieldNames.number}
                            id={fieldNames.number}
                            required
                            placeholder="1234 5678 9012 3456"
                            checkDigitValidation={validateCreditCardNumber}
                            validate={true}
                            withSubmitCount={false}
                          />
                        )}
                      </InputMask>
                    </FieldGroup>
                  </FormColumn>

                  <FormColumn>
                    <FieldGroup>
                      <InputMask
                        mask="99/9999"
                        maskChar=" "
                        value={expiry}
                        onChange={(e) => {
                          setFieldValue(fieldNames.expiry, e.target.value);
                          setExpiry(e.target.value);
                        }}
                        onFocus={(e) => setFocus('expiry')}
                        onBlur={(e) => setFieldTouched(fieldNames.expiry, true)}
                      >
                        {(inputProps) => (
                          <InputFieldItem
                            {...inputProps}
                            type="text"
                            label={`*${_('checkoutProcessForm.payment_method.expiration_date')}`}
                            fieldName={fieldNames.expiry}
                            id="expiry"
                            required
                            placeholder="MM/YYYY"
                            withSubmitCount={false}
                          />
                        )}
                      </InputMask>
                    </FieldGroup>
                  </FormColumn>
                </FormRow>

                <FormRow>
                  <FormColumn>
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
                        onFocus={(e) => setFocus('name')}
                        value={name}
                        placeholder={_('checkoutProcessForm.payment_method.placeholder_holder_name')}
                        withSubmitCount={false}
                      />
                    </FieldGroup>
                  </FormColumn>

                  <FormColumn>
                    <FieldGroup>
                      <InputMask
                        mask={cvcMask}
                        maskChar=" "
                        value={cvc}
                        onChange={(e) => {
                          setFieldValue(fieldNames.cvc, e.target.value);
                          setCvc(e.target.value);
                        }}
                        onFocus={(e) => setFocus('cvc')}
                        onBlur={(e) => setFieldTouched(fieldNames.cvc, true)}
                      >
                        {(inputProps) => (
                          <InputFieldItem
                            {...inputProps}
                            type="text"
                            label={`*${_('checkoutProcessForm.payment_method.security_code')}`}
                            fieldName={fieldNames.cvc}
                            id={fieldNames.cvc}
                            required
                            placeholder="123"
                            withSubmitCount={false}
                            value={cvc}
                          />
                        )}
                      </InputMask>
                    </FieldGroup>
                  </FormColumn>
                </FormRow>

                <SubmitButton 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? 
                    _('checkoutProcessForm.payment_method.processing') : 
                    'Guardar' 
                  }
                </SubmitButton>
              </FormSection>

              <CardPreviewSection>
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
              </CardPreviewSection>
            </FormContainer>

            {eProtectResponse && (
              <ResponseSection>
                <h4>Respuesta de eProtect:</h4>
                <pre>
                  {JSON.stringify(eProtectResponse, null, 2)}
                </pre>
              </ResponseSection>
            )}
          </>
        )}

        {/* Campos ocultos */}
        <input type="hidden" name="response$paypageRegistrationId" value={values.response$paypageRegistrationId || ''} />
        <input type="hidden" name="response$bin" value={values.response$bin || ''} />
        <input type="hidden" name="response$code" value={values.response$code || ''} />
        <input type="hidden" name="response$message" value={values.response$message || ''} />
        <input type="hidden" name="response$responseTime" value={values.response$responseTime || ''} />
        <input type="hidden" name="response$type" value={values.response$type || ''} />
        <input type="hidden" name="response$vantivTxnId" value={values.response$vantivTxnId || ''} />
        <input type="hidden" name="response$firstSix" value={values.response$firstSix || ''} />
        <input type="hidden" name="response$lastFour" value={values.response$lastFour || ''} />
        <input type="hidden" name="response$accountRangeId" value={values.response$accountRangeId || ''} />
      </CreditCardContainer>
    );
  }
);