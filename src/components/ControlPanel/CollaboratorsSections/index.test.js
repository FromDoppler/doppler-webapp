import { render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CollaboratorsSections } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

const collaborationInvitesResult = [
  {
    idUser: 1,
    email: 'test@fromdoppler.com',
    firstname: 'Test',
    lastname: 'Test',
    invitationDate: '03-07-2024',
    expirationDate: '03-07-2024',
    invitationStatus: 'PENDING',
  },
  {
    idUser: 1,
    email: 'test2@fromdoppler.com',
    firstname: 'Test 2',
    lastname: 'Test 2',
    invitationDate: '03-07-2024',
    expirationDate: '03-07-2024',
    invitationStatus: 'APPROVED',
  },
];

const dopplerUserApiClientDouble = () => ({
  getCollaborationInvites: async () => ({
    success: true,
    value: collaborationInvitesResult,
  }),
  sendCollaboratorInvite: async () => ({
    success: true,
  }),
  cancelCollaboratorInvite: async () => ({
    success: true,
  }),
});

const forcedServices = {
  dopplerUserApiClient: dopplerUserApiClientDouble(),
  appSessionRef: {
    current: {
      userData: {
        userAccount: {
          email: 'dummy@fromdoppler.com',
          firstname: 'test',
          lastname: 'test',
          userProfileType: 'USER',
        },
      },
    },
  },
};

describe('test for Collaborators Section component ', () => {
  it('Validate if loading box is hide from initial form', async () => {
    //Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorsSections />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should render table with users', async () => {
    //act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorsSections />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    //assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(screen.getByText('test@fromdoppler.com')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeInTheDocument();
  });
});
