import { BrowserRouter } from 'react-router-dom';
import { SmsPlan } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider';
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
          <DopplerIntlProvider>
            <SmsPlan sms={sms} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Envío y automatización de SMS')).toBeInTheDocument();
  });
});
