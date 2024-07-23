import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { CollaboratorInviteForm } from './CollaboratorInviteForm';

describe('CollaboratorInviteForm Component', () => {
  afterEach(cleanup);

  it('should render success form', () => {
    //Act
    render(
      <BrowserRouter>
        <DopplerIntlProvider>
          <CollaboratorInviteForm />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(screen.getByTestId('collaboration-invite-form')).toBeInTheDocument();
  });
});
