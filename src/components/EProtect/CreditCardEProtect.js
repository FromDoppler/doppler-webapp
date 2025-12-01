import React, { useEffect, useState, useRef } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Cards from 'react-credit-cards';
import { FieldGroup, FieldItem } from '../form-helpers/form-helpers';
import { actionPage } from '../Plans/Checkout/Checkout';
import creditCards from '../../img/credit-cards.svg';
import { CreditCardIcons } from '../Plans/Checkout/PaymentMethod/CreditCard';
import { getEprotectConfig } from './eprotectConfig';

const EPROTECT_SCRIPT_URL = 'https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client4.min.js';

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
    const { setFieldValue } = useFormikContext();
    const [state, setState] = useState({ scriptLoaded: false, paymentMethod: {} });
    const [isClientReady, setIsClientReady] = useState(false);
    const payframeClientRef = useRef(null);
    const pendingRequestRef = useRef(null);
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

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

    useEffect(() => {
      if (!state.scriptLoaded || optionView === actionPage.READONLY) {
        return;
      }

      const payframeClientCallback = (response) => {
        if (pendingRequestRef.current) {
          pendingRequestRef.current.resolve(response);
          pendingRequestRef.current = null;
        }
      };

      const configure = getEprotectConfig(payframeClientCallback, intl);

      const initializeEprotectClient = () => {
        const payframeElement = document.getElementById('eprotect-payframe');

        if (window.EprotectIframeClient && payframeElement) {
          try {
            payframeClientRef.current = new window.EprotectIframeClient(configure);
            setIsClientReady(true);
          } catch (error) {
            console.error('Error initializing EprotectIframeClient:', error);
            setIsClientReady(false);
          }
        } else {
          console.warn('Waiting for EprotectIframeClient or DOM element to be available');
        }
      };

      const rafId = requestAnimationFrame(() => {
        initializeEprotectClient();
      });

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
        cancelAnimationFrame(rafId);
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

    return (
      <FieldGroup>
        {optionView === actionPage.READONLY ? (
          <li className="field-item" style={{ display: 'block' }}>
            <Cards
              cvc={state.paymentMethod.ccSecurityCode}
              expiry={state.paymentMethod.ccExpiryDate}
              number={`•••• •••• •••• ${state.paymentMethod.lastFourDigitsCCNumber}`}
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
