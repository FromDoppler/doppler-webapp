import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NextInvoices } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

describe('NextInvoices', () => {
  it('should render NextInvoices', async () => {
    // Arrange
    const pathname = '/landing-packages';
    const search = '?accountType=PAID';
    const amountDetailsData = {
      value: {
        nextMonthDate: '2024-08-01T00:00:00',
        nextMonthTotal: 285,
      },
    };

    // Act
    render(
      <BrowserRouter>
        <IntlProvider>
          <NextInvoices pathname={pathname} search={search} amountDetailsData={amountDetailsData} />
        </IntlProvider>
      </BrowserRouter>,
    );

    // Assert
    screen.getByText('buy_process.upcoming_bills.marketing_plan_subtitle');
  });
});
