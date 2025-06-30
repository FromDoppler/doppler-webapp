import { BrowserRouter } from 'react-router-dom';
import { SmsPlan } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SmsPlan component', () => {
  it('should render component', () => {
    // Assert
    const sms = {
      smsEnabled: true,
      remainingCredits: 500,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SmsPlan sms={sms} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Envío y automatización de SMS')).toBeInTheDocument();
  });
});
