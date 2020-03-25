import React from 'react';
import Signup from './Signup';
import { render, cleanup, waitFor } from '@testing-library/react';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { timeout } from '../../utils';

const emptyResponse = { success: false, error: new Error('Dummy error') };

const defaultDependencies = {
  dopplerSitesClient: {
    getBannerData: async () => {
      await timeout(0);
      return emptyResponse;
    },
  },
};

describe('Signup', () => {
  beforeEach(cleanup);

  it('should not show errors on blur but after first submit', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
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

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.error')).toHaveLength(0));

    // Act
    container.querySelector('button[type="submit"]').click();

    // Assert
    await waitFor(() => expect(container.querySelectorAll('.error')).not.toHaveLength(0));
  });

  it('should show Argentina below Argelia when selected language is ES', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(container.querySelector('#iti-item-dz').nextElementSibling.id).toBe('iti-item-ar'),
    );
  });

  it('should show Territorio Palestino, Ocupado below Territorio Britanico del Oceano Indico when selected language is ES', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(container.querySelector('#iti-item-io').nextElementSibling.id).toBe('iti-item-ps'),
    );
  });

  it('should show American Samoa below Algeria when selected language is EN', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(container.querySelector('#iti-item-dz').nextElementSibling.id).toBe('iti-item-as'),
    );
  });

  it('should show Brunel below British Indian Ocean when selected language is EN', async () => {
    // Arrange
    const dependencies = defaultDependencies;
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await waitFor(() =>
      expect(container.querySelector('#iti-item-io').nextElementSibling.id).toBe('iti-item-bn'),
    );
  });
});
