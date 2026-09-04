import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { CollaboratorEditionSection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

const updateUserAccountInformation = jest.fn();

const forcedServices = {
  appSessionRef: {
    current: {
      userData: {
        userAccount: {
          email: 'dummy@fromdoppler.com',
          firstname: 'test',
          lastname: 'test',
          phone: '+5491122334455',
          weeklyAccountReportEnabled: true,
          userProfileType: 'COLLABORATOR',
        },
      },
    },
  },
  dopplerUserApiClient: {
    updateUserAccountInformation,
  },
};

describe('test for Collaborator Edition Section component ', () => {
  beforeEach(() => {
    updateUserAccountInformation.mockReset();
    updateUserAccountInformation.mockResolvedValue({ success: true });
  });

  it('should render collaborator edition form', async () => {
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorEditionSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'control_panel.account_preferences.account_information_title',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('collaborator_edition.personal_data_title')).toBeInTheDocument();
    expect(screen.getByText('collaborator_edition.change_password_title')).toBeInTheDocument();
    expect(screen.getByText('collaborator_edition.account_reports_title')).toBeInTheDocument();
    expect(screen.getByLabelText('collaborator_edition.language:')).toBeInTheDocument();
  });

  it('should update the account reports status pill when the toggle changes', async () => {
    const user = userEvent.setup();

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorEditionSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    const activeStatus = screen.getByText('common.active');
    expect(activeStatus).toBeInTheDocument();
    expect(activeStatus.closest('.pill')).toHaveClass('pill--green');

    await user.click(screen.getByRole('checkbox'));

    const inactiveStatus = screen.getByText('common.disabled');
    expect(inactiveStatus).toBeInTheDocument();
    expect(inactiveStatus.closest('.pill')).toHaveClass('pill--grey');
  });

  it('should send the selected language id when saving', async () => {
    const user = userEvent.setup();

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <CollaboratorEditionSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    const languageSelect = screen.getByLabelText('collaborator_edition.language:');
    expect(languageSelect).toHaveValue('en');

    await user.selectOptions(languageSelect, 'es');
    await user.click(screen.getByRole('button', { name: 'common.save' }));

    await waitFor(() =>
      expect(updateUserAccountInformation).toHaveBeenCalledWith({
        Firstname: 'test',
        Lastname: 'test',
        Phone: '+54 9 11 2233-4455',
        IdLanguage: 1,
        WeeklyAccountReportEnabled: true,
        CurrentPassword: '',
        NewPassword: '',
      }),
    );
  });
});
