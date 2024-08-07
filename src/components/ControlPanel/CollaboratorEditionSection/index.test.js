import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
  getByText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CollaboratorEditionSection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

const forcedServices = {
  appSessionRef: {
    current: {
      userData: {
        userAccount: {
          email: 'dummy@fromdoppler.com',
          firstname: 'test',
          lastname: 'test',
          userProfileType: 'COLLABORATOR',
        },
      },
    },
  },
};

describe('test for Collaborator Edition Section component ', () => {
  it('should render collaborator edition form', async () => {
    //act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorEditionSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    screen.getAllByText('control_panel.account_preferences.collaborator_edition_title');
  });
});
