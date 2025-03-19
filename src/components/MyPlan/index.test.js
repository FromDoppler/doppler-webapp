import { BrowserRouter } from 'react-router-dom';
import { MyPlan } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('OnSite component', () => {
  it('should render component', () => {
    // Assert
    const dependencies = {
      dopplerLegacyClient: {
        dopplerBillingUserApiClient: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
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
          <DopplerIntlProvider>
            <MyPlan />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Mi plan')).toBeInTheDocument();
  });
});
