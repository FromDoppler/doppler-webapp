import React from 'react';
import DopplerIntlProvider from './DopplerIntlProvider';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import { FormattedMessage } from 'react-intl';

describe('DopplerIntlProvider', () => {
  beforeEach(cleanup);

  it('should render loading in English', () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="en">
        <FormattedMessage id="loading" />
      </DopplerIntlProvider>,
    );
    getByText('Loading...');
  });

  it('should render loading in Spanish', () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="es">
        <FormattedMessage id="loading" />
      </DopplerIntlProvider>,
    );
    getByText('Cargando...');
  });

  it('should render loading in Spanish when language is unexpected', () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="fr">
        <FormattedMessage id="loading" />
      </DopplerIntlProvider>,
    );
    getByText('Cargando...');
  });

  it('should render loading in Spanish when language is undefined', () => {
    const { getByText } = render(
      <DopplerIntlProvider>
        <FormattedMessage id="loading" />
      </DopplerIntlProvider>,
    );
    getByText('Cargando...');
  });
});
