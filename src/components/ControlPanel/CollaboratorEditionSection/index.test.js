import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
