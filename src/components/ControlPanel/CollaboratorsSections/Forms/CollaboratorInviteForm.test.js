import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';
import { AppServicesProvider } from '../../../../services/pure-di';

describe('CollaboratorInviteForm Component', () => {
  afterEach(cleanup);

  it('should render success form', () => {
    //Arrange
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              email: 'dummy@fromdoppler.com',
            },
          },
        },
      },
    };

    //Act
    render(
      <BrowserRouter>
        <AppServicesProvider forcedServices={forcedServices}>
          <DopplerIntlProvider>
            <CollaboratorInviteForm />
          </DopplerIntlProvider>
        </AppServicesProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(screen.getByTestId('collaboration-invite-form')).toBeInTheDocument();
  });
});
