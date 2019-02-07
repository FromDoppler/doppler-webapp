import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';

import Footer from './Footer';

import { IntlProvider } from 'react-intl';
import messages_es from '../../i18n/es.json';
import messages_en from '../../i18n/en.json';

const messages = {
  es: messages_es,
  en: messages_en,
};

describe('Footer component', () => {
  afterEach(cleanup);

  it('renders footer rights reserverd message', () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages['en']}>
        <Footer />
      </IntlProvider>,
    );
    expect(getByText('All rights reserved')).toBeInTheDocument();
  });
});
