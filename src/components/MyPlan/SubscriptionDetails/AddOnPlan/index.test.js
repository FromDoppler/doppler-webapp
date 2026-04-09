import { BrowserRouter } from 'react-router-dom';
import { AddOnPlan } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AddOnType } from '../../../../doppler-types';

describe('AddOn component', () => {
  it('should render component', async () => {
    // Assert
    var addOnType = AddOnType.Conversations;
    var addOnPromotions = [];
    var conversationPlan = { active: false };

    // Act
    render(
      <AppServicesProvider>
        <AppServicesProvider>
          <BrowserRouter>
            <IntlProvider>
              <AddOnPlan
                addOnType={addOnType}
                addOnPromotions={addOnPromotions}
                addOnPlan={conversationPlan}
              />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should show the information about conversation plan', async () => {
    // Assert
    var addOnType = AddOnType.Conversations;
    var addOnPromotions = [];
    var conversationPlan = { active: false };

    // Act
    render(
      <AppServicesProvider>
        <AppServicesProvider>
          <BrowserRouter>
            <IntlProvider>
              <AddOnPlan
                addOnType={addOnType}
                addOnPromotions={addOnPromotions}
                addOnPlan={conversationPlan}
              />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText('my_plan.subscription_details.addon.conversation_plan.title'),
    ).toBeInTheDocument();
  });
});
