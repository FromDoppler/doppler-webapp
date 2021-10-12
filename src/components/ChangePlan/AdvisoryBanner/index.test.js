import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { AdvisoryBanner } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('AdvisoryBanner component', () => {
  it('should render AdvisoryBanner component', () => {
    // Act
    render(
      <Router>
        <IntlProvider>
          <AdvisoryBanner />
        </IntlProvider>
        ,
      </Router>,
    );

    // Assert
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/email-marketing-exclusive');
  });
});
