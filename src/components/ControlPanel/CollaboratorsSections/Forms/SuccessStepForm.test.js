import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { SuccessStepForm } from './SuccessStepForm';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('SuccessStepForm Component', () => {
  afterEach(cleanup);

  it('should render success form', () => {
    //Act
    render(
      <BrowserRouter>
        <DopplerIntlProvider>
          <SuccessStepForm />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(screen.getByTestId('success-form')).toBeInTheDocument();
  });
});
