import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { LandingPacksMessages } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('LandingPacksMessages', () => {
  it('should to show warning message when showArchiveLandings is true', async () => {
    render(
      <IntlProvider>
        <LandingPacksMessages
          showArchiveLandings={true}
          loadingRemoveLandingPages={false}
          errorRemoveLandingPages={null}
          successRemoveLandingPages={false}
        />
      </IntlProvider>,
    );
    screen.getByText('landing_selection.user_messages.warning_description');
    screen.getByText('landing_selection.user_messages.warning_link_title');
    expect(screen.queryByText('big_query.plus_message_saved')).not.toBeInTheDocument();
    expect(
      screen.queryByText('validation_messages.error_unexpected_register_MD'),
    ).not.toBeInTheDocument();
  });

  it('should to show saved message when there is not errors and loading is false', async () => {
    render(
      <IntlProvider>
        <LandingPacksMessages
          showArchiveLandings={false}
          loadingRemoveLandingPages={false}
          errorRemoveLandingPages={null}
          successRemoveLandingPages={true}
        />
      </IntlProvider>,
    );
    screen.getByText('big_query.plus_message_saved');
    expect(
      screen.queryByText('landing_selection.user_messages.warning_description'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('validation_messages.error_unexpected_register_MD'),
    ).not.toBeInTheDocument();
  });

  it('should to show error message when there is errors and loading is false', async () => {
    render(
      <IntlProvider>
        <LandingPacksMessages
          showArchiveLandings={false}
          loadingRemoveLandingPages={false}
          errorRemoveLandingPages={'an error'}
          successRemoveLandingPages={false}
        />
      </IntlProvider>,
    );
    screen.getByText('validation_messages.error_unexpected_register_MD');
    expect(
      screen.queryByText('landing_selection.user_messages.warning_description'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('big_query.plus_message_saved')).not.toBeInTheDocument();
  });
});
