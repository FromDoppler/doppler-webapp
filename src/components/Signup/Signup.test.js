import React from 'react';
import Signup from './Signup';
import { render, cleanup, waitForDomChange } from 'react-testing-library';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import 'jest-dom/extend-expect';

describe('Signup', () => {
  beforeEach(cleanup);

  it('should not show errors on blur but after first submit', async () => {
    // Arrange
    const { container } = render(
      <AppServicesProvider>
        <DopplerIntlProvider>
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelectorAll('.error')).toHaveLength(0);

    // Act
    container.querySelector('#lastname').focus();
    await waitForDomChange();

    // Assert
    expect(container.querySelectorAll('.error')).toHaveLength(0);

    // Act
    container.querySelector('button[type="submit"]').click();
    await waitForDomChange();

    // Assert
    expect(container.querySelectorAll('.error')).not.toHaveLength(0);
  });
});
