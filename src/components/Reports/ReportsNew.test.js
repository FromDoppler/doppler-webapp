import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './ReportsNew';

describe('Reports New page', () => {
  afterEach(cleanup);

  it('render page', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => [],
    };
    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports
          dependencies={{
            datahubClient: datahubClientDouble,
            appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          }}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('reports_filters.title')));
  });

  it('should show error when dont have domains', async () => {
    // Arrange
    const datahubClientDouble = {
      getAccountDomains: async () => {
        return { success: false };
      },
    };
    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports
          dependencies={{
            datahubClient: datahubClientDouble,
            appConfiguration: { dopplerLegacyUrl: 'http://test.localhost' },
          }}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    await waitFor(() => expect(getByText('common.unexpected_error')));
  });
});
