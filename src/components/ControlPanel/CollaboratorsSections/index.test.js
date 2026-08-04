import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
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

const availableCollaboratorSections = [
  { idSection: 1, name: 'Reports' },
  { idSection: 2, name: 'Campaigns' },
  { idSection: 999, name: 'Custom Permission' },
];

const createDopplerUserApiClientDouble = ({
  sendCollaboratorInviteResult = { success: true },
} = {}) => ({
  getCollaborationInvites: jest.fn(async () => ({
    success: true,
    value: collaborationInvitesResult,
  })),
  getAvailableCollaboratorSections: jest.fn(async () => ({
    success: true,
    value: availableCollaboratorSections,
  })),
  sendCollaboratorInvite: jest.fn(async () => sendCollaboratorInviteResult),
  cancelCollaboratorInvite: jest.fn(async () => ({
    success: true,
  })),
});

const createForcedServices = (dopplerUserApiClient) => ({
  dopplerUserApiClient,
  appSessionRef: {
    current: {
      userData: {
        user: {
          email: 'owner@fromdoppler.com',
        },
        userAccount: {
          email: 'dummy@fromdoppler.com',
          firstname: 'test',
          lastname: 'test',
          userProfileType: 'USER',
        },
      },
    },
  },
});

const renderComponent = (dopplerUserApiClient) =>
  render(
    <AppServicesProvider forcedServices={createForcedServices(dopplerUserApiClient)}>
      <BrowserRouter>
        <IntlProvider>
          <CollaboratorsSections />
        </IntlProvider>
      </BrowserRouter>
    </AppServicesProvider>,
  );

const openModalAndGoToPermissionsStep = async (user) => {
  await user.click(screen.getByRole('button', { name: 'collaborators.add_collaborator' }));
  await user.type(
    screen.getByLabelText('collaborators.form_modal.email'),
    'new.collaborator@fromdoppler.com',
  );
  await user.click(screen.getByRole('button', { name: 'common.next' }));
};

describe('CollaboratorsSections', () => {
  it('hides the loading box after the initial request', async () => {
    renderComponent(createDopplerUserApiClientDouble());

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('renders the collaborators table', async () => {
    renderComponent(createDopplerUserApiClientDouble());

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('test@fromdoppler.com')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeInTheDocument();
  });

  it('keeps the email when going back from permissions to the invite step', async () => {
    const user = userEvent.setup();
    renderComponent(createDopplerUserApiClientDouble());

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openModalAndGoToPermissionsStep(user);

    expect(
      screen.getByText('collaborators.form_modal.permissions_description'),
    ).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Custom Permission')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'common.back' }));

    await waitFor(() =>
      expect(screen.getByLabelText('collaborators.form_modal.email')).toHaveValue(
        'new.collaborator@fromdoppler.com',
      ),
    );
  });

  it('does not allow advancing without selecting permissions', async () => {
    const user = userEvent.setup();
    renderComponent(createDopplerUserApiClientDouble());

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openModalAndGoToPermissionsStep(user);
    await user.click(screen.getByRole('button', { name: 'common.next' }));

    expect(screen.getByText('collaborators.form_modal.permissions_error')).toBeInTheDocument();
  });

  it('sends the selected permissions as CSV and moves to success only when submit succeeds', async () => {
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble();
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openModalAndGoToPermissionsStep(user);
    await user.click(screen.getByLabelText('Reports'));
    await user.click(screen.getByLabelText('Campaigns'));
    await user.click(screen.getByRole('button', { name: 'common.next' }));

    await waitFor(() =>
      expect(dopplerUserApiClient.sendCollaboratorInvite).toHaveBeenCalledWith({
        email: 'new.collaborator@fromdoppler.com',
        idSections: '1,2',
      }),
    );
    expect(dopplerUserApiClient.getAvailableCollaboratorSections).toHaveBeenCalledTimes(1);
    expect(screen.getByText('collaborators.form_modal.success_title')).toBeInTheDocument();
  });

  it('stays on permissions and shows an error when the submit fails', async () => {
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble({
      sendCollaboratorInviteResult: { success: false },
    });
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openModalAndGoToPermissionsStep(user);
    await user.click(screen.getByLabelText('Reports'));
    await user.click(screen.getByRole('button', { name: 'common.next' }));

    await waitFor(() => expect(screen.getByText('common.unexpected_error')).toBeInTheDocument());
    expect(screen.getByTestId('collaboration-permissions-form')).toBeInTheDocument();
    expect(screen.queryByText('collaborators.form_modal.success_title')).not.toBeInTheDocument();
  });
});
