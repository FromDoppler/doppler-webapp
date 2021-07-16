import React from 'react';
import { render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthorizationPage } from './AuthorizationPage';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('test for validate authorization form component ', () => {
  it('Validate if loading box is hide from initial form', async () => {
    // Arrange
    const result = {
      emails: ['email1@gmail.com', 'email2@gmail.com', 'email3@gmail.com'],
    };

    const bigQueryClientDouble = {
      getEmailsData: async () => {
        return { emails: result.emails };
      },
    };

    //Act
    const { container } = render(
      <AppServicesProvider
        forcedServices={{
          bigQueryClient: bigQueryClientDouble,
        }}
      >
        <IntlProvider>
          <AuthorizationPage />
        </IntlProvider>
      </AppServicesProvider>,
    );

    //Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
