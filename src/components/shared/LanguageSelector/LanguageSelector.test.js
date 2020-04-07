import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LanguageSelector from './LanguageSelector';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

const defaultDependencies = {
  window: {
    MenuButton: {},
  },
};

describe('Language Selector Component', () => {
  afterEach(cleanup);

  it('should show EN language to change when dont have parameters and current is ES', () => {
    // Arrange
    const urlParameters = '';
    // Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={defaultDependencies}>
        <DopplerIntlProvider locale="es">
          <LanguageSelector urlParameters={urlParameters} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
      { wrapper: MemoryRouter },
    );
    // Assert
    expect(getByText('EN')).toBeInTheDocument();
  });

  it('should show EN language to change when have url parameter with lang=ES', () => {
    // Arrange
    const urlParameters = '?lang=ES';
    // Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={defaultDependencies}>
        <DopplerIntlProvider locale="es">
          <LanguageSelector urlParameters={urlParameters} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
      { wrapper: MemoryRouter },
    );
    // Assert
    expect(getByText('EN')).toBeInTheDocument();
  });

  it('should show ES language to change when have url parameter with lang=EN', () => {
    // Arrange
    const urlParameters = '?lang=EN&redirect=test';
    // Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={defaultDependencies}>
        <DopplerIntlProvider locale="en">
          <LanguageSelector urlParameters={urlParameters} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
      { wrapper: MemoryRouter },
    );
    // Assert
    expect(getByText('ES')).toBeInTheDocument();
  });
});
