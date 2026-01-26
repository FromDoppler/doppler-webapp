import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Cards from 'react-credit-cards';
import { FieldGroup, FieldItem } from '../form-helpers/form-helpers';
import { actionPage } from '../Plans/Checkout/Checkout';
import creditCards from '../../img/credit-cards.svg';
import { CreditCardIcons } from '../Plans/Checkout/PaymentMethod/CreditCard';
import { getEprotectConfig } from './eprotectConfig';
import { fieldNames, paymentType } from '../Plans/Checkout/PaymentMethod/PaymentMethod';

const EPROTECT_SCRIPT_URL = process.env.REACT_APP_EPROTECT_SCRIPT_URL;

const creditCardType = {
  mastercard: 'Mastercard',
  visa: 'Visa',
  amex: 'American Express',
};

const amexDescription = 'amex';

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

export const CreditCardEProtect = InjectAppServices(
  ({ dependencies: { appSessionRef }, optionView, paymentMethod, onClientReady }) => {
    const intl = useIntl();
    const { setFieldValue, setValues } = useFormikContext();
    const [state, setState] = useState({ scriptLoaded: false, paymentMethod: {} });
    const [isClientReady, setIsClientReady] = useState(false);
    const payframeClientRef = useRef(null);
    const pendingRequestRef = useRef(null);
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

      useEffect(() => {
        if (optionView === actionPage.UPDATE) {
          setValues({
            [fieldNames.name]: '',
            [fieldNames.number]: '',
            [fieldNames.expiry]: '',
            [fieldNames.cvc]: '',
            [fieldNames.paymentMethodName]: paymentType.creditCard,
          });
        }
      }, [appSessionRef, optionView, setValues]);

    useEffect(() => {
      const loadEprotectScript = () => {
        if (document.querySelector(`script[src="${EPROTECT_SCRIPT_URL}"]`)) {
          setState((prevState) => ({ ...prevState, scriptLoaded: true }));
          return;
        }

        const script = document.createElement('script');
        script.src = EPROTECT_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
          setState((prevState) => ({ ...prevState, scriptLoaded: true }));
        };
        script.onerror = () => {
          console.error('Failed to load eProtect script');
          setState((prevState) => ({ ...prevState, scriptLoaded: false }));
        };
        document.head.appendChild(script);
      };

      loadEprotectScript();

      setState((prevState) => ({ ...prevState, paymentMethod:
          paymentMethod && Object.keys(paymentMethod).length > 1
            ? paymentMethod
            : {
                ccSecurityCode: '',
                ccExpiryDate: '',
                ccHolderName: '',
                ccNumber: '',
                ccType: '',
              }, }) );
    }, [optionView, appSessionRef, paymentMethod]);

    useLayoutEffect(() => {
      if (!state.scriptLoaded || optionView === actionPage.READONLY) {
        if (optionView === actionPage.READONLY) {
          payframeClientRef.current = null;
          setIsClientReady(false);
        }
        return;
      }

      payframeClientRef.current = null;
      setIsClientReady(false);

      const payframeClientCallback = (response) => {
        if (pendingRequestRef.current) {
          pendingRequestRef.current.resolve(response);
          pendingRequestRef.current = null;
        }
      };

      const configure = getEprotectConfig(payframeClientCallback, intl);
      let pollingIntervalId = null;

      const initializeEprotectClient = () => {
        const payframeElement = document.getElementById('eprotect-payframe');

        if (window.EprotectIframeClient && payframeElement) {
          try {
            if (!payframeClientRef.current) {
              payframeClientRef.current = new window.EprotectIframeClient(configure);
              setIsClientReady(true);

              if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                pollingIntervalId = null;
              }

              return true;
            } else {
              return true;
            }
          } catch (error) {
            console.error('Error initializing EprotectIframeClient:', error);
            setIsClientReady(false);
            return false;
          }
        } else {
          console.warn('Waiting for EprotectIframeClient or DOM element to be available');
          return false;
        }
      };

      let retryCount = 0;
      const maxRetries = 50;
      const retryInterval = 100;

      const attemptInitialization = () => {
        const initialized = initializeEprotectClient();

        if (initialized) {
          return true;
        }

        retryCount++;

        if (retryCount >= maxRetries) {
          console.error('Failed to initialize EprotectIframeClient after', maxRetries, 'attempts');
          if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            pollingIntervalId = null;
          }
          return true;
        }

        return false;
      };

      const initialized = attemptInitialization();

      if (!initialized) {
        pollingIntervalId = setInterval(() => {
          attemptInitialization();
        }, retryInterval);
      }

      const handleEnterKey = (event) => {
        if (event.data === 'checkoutWithEnter') {
          const timestamp = Date.now();
          const message = {
            id: `${timestamp}`,
            orderId: `order_${timestamp}`,
          };
          if (payframeClientRef.current) {
            payframeClientRef.current.getPaypageRegistrationId(message);
          }
        }
      };

      window.addEventListener('message', handleEnterKey);

      return () => {
        if (pollingIntervalId) {
          clearInterval(pollingIntervalId);
        }
        window.removeEventListener('message', handleEnterKey);
      };
    }, [state.scriptLoaded, optionView, setFieldValue, appSessionRef, intl]);

    const requestPaypageRegistrationId = () => {
      if (!payframeClientRef.current) {
        console.error('payframeClient not initialized');
        return Promise.reject(new Error('Payment form not ready'));
      }

      return new Promise((resolve, reject) => {
        pendingRequestRef.current = { resolve, reject };

        const timestamp = Date.now().toString();
        const message = {
          id: timestamp,
          orderId: `order_${timestamp}`,
        };

        payframeClientRef.current.getPaypageRegistrationId(message);
      });
    };

    useEffect(() => {
      if (isClientReady && onClientReady) {
        onClientReady({
          requestPaypageRegistrationId,
          isReady: () => !!payframeClientRef.current,
        });
      }
    }, [isClientReady, onClientReady]);

    const getFormattedCardNumber = () => {
      let lastFour = '';

      if (state.paymentMethod.lastFourDigitsCCNumber) {
        lastFour = state.paymentMethod.lastFourDigitsCCNumber;
      } else if (state.paymentMethod.ccNumber) {
        lastFour = state.paymentMethod.ccNumber.replace(/\s/g, '').slice(-4);
      } else {
        lastFour = '••••';
      }

      const isAmex = state.paymentMethod.ccType === creditCardType.amex;
      const asteriskCount = isAmex ? 11 : 12;
      const maskedNumber = '•'.repeat(asteriskCount);

      return `${maskedNumber}${lastFour}`;
    };

    return (
      <FieldGroup>
        {optionView === actionPage.READONLY ? (
          <li className="field-item" style={{ display: 'block' }}>
            <Cards
              cvc={state.paymentMethod.ccSecurityCode}
              expiry={state.paymentMethod.ccExpiryDate}
              number={getFormattedCardNumber()}
              name={state.paymentMethod.ccHolderName}
              issuer={getCreditCardIssuer(state.paymentMethod.ccType)}
              preview={true}
              placeholders={{
                name: "",
              }}
              locale={{ valid: _('checkoutProcessForm.payment_method.valid_thru') }}
            />
          </li>
        ) : (
          <>
            <FieldItem className="field-item">
              <div className="dp-considerations" style={{marginBottom: 0}}>
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
            <FieldItem className="field-item">
              <div id="eprotect-payframe" style={{ width: "400px" }} ></div>
            </FieldItem>
          </>
        )}
      </FieldGroup>
    );
  },
);
