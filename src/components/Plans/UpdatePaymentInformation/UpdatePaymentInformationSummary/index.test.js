import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdatePaymentInformationSummary from '.';
import { fakeDeclinedInvoices } from '../../../../services/doppler-billing-user-api-client.double';

const dependencies = (dopplerBillingUserApiClientDouble) => ({
  dopplerBillingUserApiClient: dopplerBillingUserApiClientDouble,
});

const dopplerBillingUserApiClientDoubleBase = {
  getDeclinedInvoices: async () => {
    return { success: true, value: fakeDeclinedInvoices };
  },
};

const UpdatePaymentInformationSummaryElement = ({ url, dopplerBillingUserApiClientDouble }) => {
  const services = dependencies(dopplerBillingUserApiClientDouble);

  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route
              path="/payment-information-summary"
              element={<UpdatePaymentInformationSummary />}
            />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('UpdatePaymentInformationSummary component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(
      <UpdatePaymentInformationSummaryElement
        url="/payment-information-summary?success=true&allInvoicesProcessed=false&anyPendingInvoices=true"
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);
  });

  it('should show the reprocess has been successful when success is true and allInvoicesProcessed is true', async () => {
    // Act
    render(
      <UpdatePaymentInformationSummaryElement
        url="/payment-information-summary?success=true&allInvoicesProcessed=true&anyPendingInvoices=false"
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`updatePaymentInformationSuccess.all_invoices_processed_message`);
    screen.getByText(`updatePaymentInformationSuccess.all_invoices_processed_message`);
  });

  it('should show the reprocess has been partially successful when success is true and allInvoicesProcessed is false', async () => {
    // Act
    render(
      <UpdatePaymentInformationSummaryElement
        url="/payment-information-summary?success=true&allInvoicesProcessed=false&anyPendingInvoices=false"
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`updatePaymentInformationSuccess.not_all_invoices_processed_title`);
    screen.getByText(`updatePaymentInformationSuccess.not_all_invoices_processed_legend`);
    screen.getByText(`updatePaymentInformationSuccess.not_all_invoices_processed_message`);
  });

  it('should show the reprocess has been partially successful when success is true and anyPendingInvoices is true', async () => {
    // Act
    render(
      <UpdatePaymentInformationSummaryElement
        url="/payment-information-summary?success=true&allInvoicesProcessed=false&anyPendingInvoices=true"
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`updatePaymentInformationSuccess.payment_pending_title`);
    screen.getByText(`updatePaymentInformationSuccess.payment_pending_message_line1`);
    screen.getByText(`updatePaymentInformationSuccess.payment_pending_message_line2`);
  });

  it('should show the reprocess has been rejected when success is false', async () => {
    // Act
    render(
      <UpdatePaymentInformationSummaryElement
        url="/payment-information-summary?success=false&allInvoicesProcessed=false&anyPendingInvoices=false"
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`updatePaymentInformationSuccess.rejected_payments_title`);
    screen.getByText(`updatePaymentInformationSuccess.rejected_payments_legend_1`);
    screen.getByText(`updatePaymentInformationSuccess.rejected_payments_legend_2`);
    screen.getByText(`updatePaymentInformationSuccess.rejected_payments_message`);
  });
});
