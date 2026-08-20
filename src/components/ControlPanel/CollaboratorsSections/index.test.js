import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { CollaboratorsSections } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

const collaboratorPermissionsFlagName = 'REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED';
const originalCollaboratorPermissionsFlag = process.env[collaboratorPermissionsFlagName];

const collaborationInvitesResult = [
  {
    idUser: 1,
    idUserAccount: 101,
    email: 'test@fromdoppler.com',
    firstname: 'Test',
    lastname: 'Test',
    invitationDate: '03-07-2024',
    expirationDate: '03-07-2024',
    sections: [1, 4, 8],
    invitationStatus: 'PENDING',
  },
  {
    idUser: 1,
    idUserAccount: 202,
    email: 'test2@fromdoppler.com',
    firstname: 'Test 2',
    lastname: 'Test 2',
    invitationDate: '03-07-2024',
    expirationDate: '03-07-2024',
    sections: [1, 2, 10, 18],
    invitationStatus: 'APPROVED',
  },
];

const availableCollaboratorSections = [
  { idSection: 1, name: 'Reports' },
  { idSection: 2, name: 'Campaigns' },
  { idSection: 10, name: 'Automation' },
  { idSection: 18, name: 'Landings' },
  { idSection: 999, name: 'Custom Permission' },
];

const createDopplerUserApiClientDouble = ({
  sendCollaboratorInviteResult = { success: true },
  updateCollaboratorResult = { success: true },
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
  updateCollaborator: jest.fn(async () => updateCollaboratorResult),
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
  await user.click(screen.getByRole('button', { name: 'collaborators.add_collaborator_button' }));
  await user.type(
    screen.getByLabelText('collaborators.form_modal.email'),
    'new.collaborator@fromdoppler.com',
  );
  await user.click(screen.getByRole('button', { name: 'common.next' }));
};

const openEditPermissionsModal = async (user, collaboratorIndex = 0) => {
  await user.click(screen.getByTestId(`collaborator-menu-toggle-${collaboratorIndex}`));
  await user.click(screen.getByTestId(`collaborator-menu-edit-${collaboratorIndex}`));
};

describe('CollaboratorsSections', () => {
  beforeEach(() => {
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'true';
  });

  afterAll(() => {
    if (originalCollaboratorPermissionsFlag === undefined) {
      delete process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED;
    } else {
      process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = originalCollaboratorPermissionsFlag;
    }
  });

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

  it('does not load collaborator permissions or show the edit action when the flag is disabled', async () => {
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'false';
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble();
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(dopplerUserApiClient.getAvailableCollaboratorSections).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('collaborator-menu-toggle-0'));

    expect(screen.queryByTestId('collaborator-menu-edit-0')).not.toBeInTheDocument();
    expect(screen.getByText('collaborators.menu.invite')).toBeInTheDocument();
    expect(screen.getAllByText('collaborators.menu.disable').length).toBeGreaterThan(0);
  });

  it('sends the invite without permissions and skips the permissions step when the flag is disabled', async () => {
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'false';
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble();
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await user.click(
      screen.getByRole('button', { name: 'collaborators.add_collaborator_button' }),
    );
    await user.type(
      screen.getByLabelText('collaborators.form_modal.email'),
      'new.collaborator@fromdoppler.com',
    );
    await user.click(screen.getByRole('button', { name: 'common.next' }));

    await waitFor(() =>
      expect(dopplerUserApiClient.sendCollaboratorInvite).toHaveBeenCalledWith({
        email: 'new.collaborator@fromdoppler.com',
      }),
    );
    expect(dopplerUserApiClient.getAvailableCollaboratorSections).not.toHaveBeenCalled();
    expect(screen.queryByTestId('collaboration-permissions-form')).not.toBeInTheDocument();
    expect(screen.getByText('collaborators.form_modal.success_title')).toBeInTheDocument();
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

  it('sends the selected permissions as an array and moves to success only when submit succeeds', async () => {
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
        sections: [1, 2],
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

  it('opens edit permissions with the current collaborator permissions selected', async () => {
    const user = userEvent.setup();
    renderComponent(createDopplerUserApiClientDouble());

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openEditPermissionsModal(user, 1);

    expect(
      screen.getByRole('heading', {
        name: 'collaborators.form_modal.edit_permissions_title: test2@fromdoppler.com',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.save' })).toBeInTheDocument();
    expect(screen.getByLabelText('Reports')).toBeChecked();
    expect(screen.getByLabelText('Campaigns')).toBeChecked();
    expect(screen.getByLabelText('Automation')).toBeChecked();
    expect(screen.getByLabelText('Landings')).toBeChecked();
    expect(screen.getByLabelText('Custom Permission')).not.toBeChecked();
  });

  it('updates collaborator permissions and shows the edit success state', async () => {
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble();
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openEditPermissionsModal(user, 1);
    await user.click(screen.getByLabelText('Custom Permission'));
    await user.click(screen.getByRole('button', { name: 'common.save' }));

    await waitFor(() =>
      expect(dopplerUserApiClient.updateCollaborator).toHaveBeenCalledWith({
        email: 'test2@fromdoppler.com',
        idUser: 1,
        idUserAccount: 202,
        sections: [1, 2, 10, 18, 999],
      }),
    );
    expect(screen.getByText('collaborators.form_modal.edit_success_title')).toBeInTheDocument();
    expect(screen.getByText('collaborators.form_modal.edit_success_subtitle')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'collaborators.form_modal.edit_success_acknowledge',
      }),
    ).toBeInTheDocument();
  });

  it('stays on edit permissions and shows an error when updating the collaborator fails', async () => {
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble({
      updateCollaboratorResult: { success: false },
    });
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openEditPermissionsModal(user, 1);
    await user.click(screen.getByRole('button', { name: 'common.save' }));

    await waitFor(() => expect(screen.getByText('common.unexpected_error')).toBeInTheDocument());
    expect(screen.getByTestId('collaboration-permissions-form')).toBeInTheDocument();
    expect(
      screen.queryByText('collaborators.form_modal.edit_success_title'),
    ).not.toBeInTheDocument();
  });

  it('sends null idUserAccount when the collaborator does not have one', async () => {
    const user = userEvent.setup();
    const dopplerUserApiClient = createDopplerUserApiClientDouble();
    dopplerUserApiClient.getCollaborationInvites.mockResolvedValueOnce({
      success: true,
      value: [
        {
          idUser: 7,
          idUserAccount: null,
          email: 'null-account@fromdoppler.com',
          firstname: 'Null',
          lastname: 'Account',
          invitationDate: '03-07-2024',
          expirationDate: '03-07-2024',
          sections: [1],
          invitationStatus: 'APPROVED',
        },
      ],
    });
    renderComponent(dopplerUserApiClient);

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await openEditPermissionsModal(user, 0);
    await user.click(screen.getByRole('button', { name: 'common.save' }));

    await waitFor(() =>
      expect(dopplerUserApiClient.updateCollaborator).toHaveBeenCalledWith({
        email: 'null-account@fromdoppler.com',
        idUser: 7,
        idUserAccount: null,
        sections: [1],
      }),
    );
  });
});
