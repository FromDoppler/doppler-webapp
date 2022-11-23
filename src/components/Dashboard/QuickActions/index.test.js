import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { QuickActions } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { QUICK_ACTIONS } from '../Dashboard';

describe('QuickActions', () => {
  it('should render quick actions', async () => {
    // Act
    render(
      <IntlProvider>
        <QuickActions quickActions={QUICK_ACTIONS} />
      </IntlProvider>,
    );

    // Assert
    QUICK_ACTIONS.forEach((qa) => {
      screen.getByRole('link', { name: qa.labelId });
    });
  });
});
