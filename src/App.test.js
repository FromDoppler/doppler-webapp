import React from 'react';
import 'react-testing-library/cleanup-after-each';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';

import { IntlProvider } from 'react-intl';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';

const messages = {
  es: messages_es,
  en: messages_en,
};

it('renders welcome message', () => {
  const { getByText } = render(
    <IntlProvider locale="en" messages={messages['en']}>
      <App />
    </IntlProvider>,
  );
  expect(getByText('Learn React')).toBeInTheDocument();
});
