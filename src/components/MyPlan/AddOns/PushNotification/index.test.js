import { BrowserRouter } from 'react-router-dom';
import { PushNotification } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('PushNotification component', () => {
  it('should render component', () => {
    // Assert
    const pushNotification = {
      active: true,
      plan: {
        buttonText: 'COMENZAR',
        buttonUrl: '',
      },
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <PushNotification pushNotification={pushNotification} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.push_notification.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.push_notification.description')).toBeInTheDocument();
  });
});
