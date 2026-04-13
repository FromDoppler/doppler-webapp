import { BrowserRouter } from 'react-router-dom';
import { SuccessAddOnCancellation } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SuccessAddOnCancellation component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SuccessAddOnCancellation />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.success_addon_cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.success_addon_cancellation.description'),
    ).toBeInTheDocument();
  });
});
