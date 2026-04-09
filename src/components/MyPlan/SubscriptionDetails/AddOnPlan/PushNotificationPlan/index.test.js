import { BrowserRouter } from 'react-router-dom';
import { PushNotificationPlan } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PushNotificationPlan component', () => {
  it('should render component', async () => {
    // Assert
    var pushNotificationPlan = {
      active: true,
      additional: 0,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <AppServicesProvider forcedServices={dependencies}>
          <BrowserRouter>
            <IntlProvider>
              <PushNotificationPlan
                addOnPromotions={[]}
                pushNotificationPlan={pushNotificationPlan}
              />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.subscription_details.addon.push_notification_plan.title'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.change_plan_button')).toBeInTheDocument();
  });
});
