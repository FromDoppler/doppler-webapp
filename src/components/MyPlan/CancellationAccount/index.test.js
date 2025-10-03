import { BrowserRouter } from 'react-router-dom';
import { CancellationAccount } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('CancellationAccount component', () => {
  it('should render component', () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isFreeAccount: true,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <CancellationAccount />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.title')).toBeInTheDocument();
  });
});
