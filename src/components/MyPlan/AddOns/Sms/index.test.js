import { BrowserRouter } from 'react-router-dom';
import { Sms } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Sms component', () => {
  it('should render component', () => {
    // Assert
    const sms = {
      smsEnabled: false,
      buttonUrl: '',
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <Sms sms={sms} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.sms.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.sms.description')).toBeInTheDocument();
  });
});
