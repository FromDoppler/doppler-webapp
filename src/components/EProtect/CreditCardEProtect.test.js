import { render, screen, waitFor } from '@testing-library/react';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakePaymentMethodInformation } from '../../services/doppler-billing-user-api-client.double';
import { actionPage } from '../Plans/Checkout/Checkout';
import { CreditCardEProtect } from './CreditCardEProtect';
import { Formik } from 'formik';
import '@testing-library/jest-dom/extend-expect';

const mockEprotectScriptUrl =
  'https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client4.min.js';
process.env.REACT_APP_EPROTECT_SCRIPT_URL = mockEprotectScriptUrl;

const mockEprotectClient = {
  getPaypageRegistrationId: jest.fn(),
};

const dependencies = () => ({
  appSessionRef: {
    current: {
      userData: {
        user: {
          email: 'hardcoded@email.com',
          plan: {
            planType: '1',
            planSubscription: 1,
            monthPlan: 1,
          },
        },
      },
    },
  },
});

const initialPropsReadonlyView = {
  optionView: actionPage.READONLY,
};

const initialPropsUpdateView = {
  optionView: actionPage.UPDATE,
};

const getFormFields = (container) => {
  const cardNumberElement = container.querySelector('.rccs__number');
  const cardHolderElement = container.querySelector('.rccs__name');
  const expiryDateElement = container.querySelector('.rccs__expiry__value');
  const securityCodeElement = container.querySelector('.rccs__cvc');

  return {
    cardNumberElement,
    cardHolderElement,
    expiryDateElement,
    securityCodeElement,
  };
};

const CreditCardEProtectElement = ({ withError, updateView, onClientReady }) => {
  const services = dependencies();
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          <Formik>
            <CreditCardEProtect
              {...(updateView === actionPage.UPDATE
                ? initialPropsUpdateView
                : initialPropsReadonlyView)}
              paymentMethod={
                withError
                  ? null
                  : {
                      ...fakePaymentMethodInformation,
                      lastFourDigitsCCNumber: '1234',
                    }
              }
              onClientReady={onClientReady}
            />
          </Formik>
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('CreditCardEProtect component', () => {
  let scriptElement;

  beforeEach(() => {
    const existingScript = document.querySelector(`script[src="${mockEprotectScriptUrl}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    window.EprotectIframeClient = jest.fn().mockImplementation(() => mockEprotectClient);

    scriptElement = null;
  });

  afterEach(() => {
    if (scriptElement) {
      scriptElement.remove();
    }
    delete window.EprotectIframeClient;
    jest.clearAllMocks();
  });

  it('readonly view - should load data from payment method correctly', async () => {
    const { container } = render(
      <CreditCardEProtectElement withError={false} updateView={actionPage.READONLY} />,
    );

    await waitFor(() => {
      const { cardNumberElement, cardHolderElement, expiryDateElement } = getFormFields(container);

      expect(cardNumberElement.textContent.replace(/\s/g, '')).toContain('1234');
      expect(cardHolderElement.textContent).toEqual(fakePaymentMethodInformation.ccHolderName);
      expect(expiryDateElement.textContent).toEqual(fakePaymentMethodInformation.ccExpiryDate);
    });
  });

  it('readonly view - should show masked card number with last 4 digits', async () => {
    const { container } = render(
      <CreditCardEProtectElement withError={false} updateView={actionPage.READONLY} />,
    );

    await waitFor(() => {
      const { cardNumberElement } = getFormFields(container);
      const cardNumber = cardNumberElement.textContent.replace(/\s/g, '');

      expect(cardNumber).toContain('••••');
      expect(cardNumber).toContain('1234');
    });
  });

  it('update view - should load eProtect script and show iframe container', async () => {
    render(<CreditCardEProtectElement withError={false} updateView={actionPage.UPDATE} />);

    await waitFor(() => {
      const eprotectPayframe = document.getElementById('eprotect-payframe');
      expect(eprotectPayframe).toBeInTheDocument();
    });
  });

  it('update view - should show the available credit cards legend', async () => {
    render(<CreditCardEProtectElement withError={false} updateView={actionPage.UPDATE} />);

    const availableCardsLegend = await screen.findByText(
      'checkoutProcessForm.payment_method.availabled_credit_cards_legend',
    );

    expect(availableCardsLegend).toBeInTheDocument();
  });

  it('readonly view - should hide the available credit cards legend', async () => {
    render(<CreditCardEProtectElement withError={false} updateView={actionPage.READONLY} />);

    const availableCardsLegend = screen.queryByText(
      'checkoutProcessForm.payment_method.availabled_credit_cards_legend',
    );

    expect(availableCardsLegend).not.toBeInTheDocument();
  });

  it('should be empty values in the card when the payment method is null', async () => {
    const emptyCardNumber = '••••••••••••••••';
    const emptyExpiryDate = '••/••';

    const { container } = render(
      <CreditCardEProtectElement withError={true} updateView={actionPage.READONLY} />,
    );

    await waitFor(() => {
      const { cardNumberElement, expiryDateElement } = getFormFields(container);

      expect(cardNumberElement.textContent.replace(/\s/g, '')).toContain('••••');
      expect(expiryDateElement.textContent).toEqual(emptyExpiryDate);
    });
  });

  it('update view - should initialize EprotectIframeClient when script is loaded', async () => {
    const onClientReady = jest.fn();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await waitFor(
      () => {
        expect(document.getElementById('eprotect-payframe')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('update view - should call onClientReady with requestPaypageRegistrationId function', async () => {
    const onClientReady = jest.fn();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await waitFor(
      () => {
        if (onClientReady.mock.calls.length > 0) {
          const clientApi = onClientReady.mock.calls[0][0];
          expect(clientApi).toHaveProperty('requestPaypageRegistrationId');
          expect(clientApi).toHaveProperty('isReady');
          expect(typeof clientApi.requestPaypageRegistrationId).toBe('function');
          expect(typeof clientApi.isReady).toBe('function');
        }
      },
      { timeout: 3000 },
    );
  });

  it('readonly view - should display correct card issuer for different card types', async () => {
    const visaPaymentMethod = {
      ...fakePaymentMethodInformation,
      ccType: 'Visa',
      lastFourDigitsCCNumber: '4111',
    };

    const { container, rerender } = render(
      <AppServicesProvider forcedServices={dependencies()}>
        <IntlProvider>
          <BrowserRouter>
            <Formik>
              <CreditCardEProtect {...initialPropsReadonlyView} paymentMethod={visaPaymentMethod} />
            </Formik>
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitFor(() => {
      const cardElement = container.querySelector('.rccs');
      expect(cardElement).toBeInTheDocument();
    });

    const amexPaymentMethod = {
      ...fakePaymentMethodInformation,
      ccType: 'American Express',
      lastFourDigitsCCNumber: '1234',
    };

    rerender(
      <AppServicesProvider forcedServices={dependencies()}>
        <IntlProvider>
          <BrowserRouter>
            <Formik>
              <CreditCardEProtect {...initialPropsReadonlyView} paymentMethod={amexPaymentMethod} />
            </Formik>
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitFor(() => {
      const cardElement = container.querySelector('.rccs');
      expect(cardElement).toBeInTheDocument();
    });
  });

  it('update view - should not initialize client in readonly mode', async () => {
    const onClientReady = jest.fn();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.READONLY}
        onClientReady={onClientReady}
      />,
    );

    await waitFor(() => {
      const eprotectPayframe = document.getElementById('eprotect-payframe');
      expect(eprotectPayframe).not.toBeInTheDocument();
    });
  });

  it('update view - should handle script load error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CreditCardEProtectElement withError={false} updateView={actionPage.UPDATE} />);

    let eprotectScript;
    await waitFor(() => {
      const scripts = document.querySelectorAll('script');
      eprotectScript = Array.from(scripts).find((s) =>
        s.src && s.src.includes('eProtect')
      );
      expect(eprotectScript).toBeDefined();
    });

    if (eprotectScript && eprotectScript.onerror) {
      eprotectScript.onerror();
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load eProtect script');
    });

    consoleErrorSpy.mockRestore();
  });

  it('update view - should not reload script if already exists in DOM', async () => {
    const existingScript = document.createElement('script');
    existingScript.src = mockEprotectScriptUrl;
    document.head.appendChild(existingScript);

    render(<CreditCardEProtectElement withError={false} updateView={actionPage.UPDATE} />);

    await waitFor(() => {
      const scripts = document.querySelectorAll(`script[src="${mockEprotectScriptUrl}"]`);
      expect(scripts.length).toBe(1);
    });

    existingScript.remove();
  });

  it('update view - should handle window message event for checkout with Enter key', async () => {
    const onClientReady = jest.fn();
    mockEprotectClient.getPaypageRegistrationId.mockClear();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await waitFor(
      () => {
        expect(window.EprotectIframeClient).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    window.postMessage('checkoutWithEnter', '*');

    await waitFor(() => {
      expect(mockEprotectClient.getPaypageRegistrationId).toHaveBeenCalled();
    });
  });

  it('update view - should call requestPaypageRegistrationId successfully', async () => {
    const onClientReady = jest.fn();
    const mockResponse = { paypageRegistrationId: 'test-reg-id-123' };

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    let clientApi;
    await waitFor(
      () => {
        expect(onClientReady).toHaveBeenCalled();
        clientApi = onClientReady.mock.calls[0][0];
      },
      { timeout: 3000 },
    );

    const promise = clientApi.requestPaypageRegistrationId();

    const configureCall = window.EprotectIframeClient.mock.calls[0][0];
    const callback = configureCall.callback;
    callback(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('update view - should reject when requestPaypageRegistrationId is called without initialized client', async () => {
    const onClientReady = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    window.EprotectIframeClient = jest.fn().mockImplementation(() => {
      throw new Error('Initialization failed');
    });

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error initializing EprotectIframeClient:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('update view - should call isReady function correctly', async () => {
    const onClientReady = jest.fn();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    let clientApi;
    await waitFor(
      () => {
        expect(onClientReady).toHaveBeenCalled();
        clientApi = onClientReady.mock.calls[0][0];
      },
      { timeout: 3000 },
    );

    expect(clientApi.isReady()).toBe(true);
  });

  it('update view - should warn when EprotectIframeClient is not available', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    delete window.EprotectIframeClient;

    render(<CreditCardEProtectElement withError={false} updateView={actionPage.UPDATE} />);

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Waiting for EprotectIframeClient or DOM element to be available',
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('update view - should handle payframeClientCallback without pending request', async () => {
    const onClientReady = jest.fn();

    render(
      <CreditCardEProtectElement
        withError={false}
        updateView={actionPage.UPDATE}
        onClientReady={onClientReady}
      />,
    );

    const scripts = document.querySelectorAll('script');
    const eprotectScript = Array.from(scripts).find((s) => s.src === mockEprotectScriptUrl);

    if (eprotectScript && eprotectScript.onload) {
      eprotectScript.onload();
    }

    await waitFor(
      () => {
        expect(window.EprotectIframeClient).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    const configureCall = window.EprotectIframeClient.mock.calls[0][0];
    const callback = configureCall.callback;

    expect(() => callback({ someResponse: 'data' })).not.toThrow();
  });
});
