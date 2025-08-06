import { BrowserRouter } from 'react-router-dom';
import { Collaborators } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Collaborators component', () => {
  it('should render component', async () => {
    // Assert
    const dopplerUserApiClientDouble = {
      getCollaborationInvites: async () => {
        return { success: true, value: [] };
      },
    };

    const dependencies = {
      dopplerUserApiClient: dopplerUserApiClientDouble,
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <Collaborators />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getAllByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('my_plan.addons.collaborators.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.collaborators.description')).toBeInTheDocument();
  });
});
