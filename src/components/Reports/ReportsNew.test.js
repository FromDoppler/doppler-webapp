import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Reports from './ReportsNew';

describe('Reports New page', () => {
  afterEach(cleanup);

  it('render page', () => {
    // Arrange
    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(getByText('reports_title'));
  });
});
