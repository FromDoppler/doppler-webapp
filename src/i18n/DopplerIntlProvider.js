import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import messages_es from './es.json';
import messages_en from './en.json';
import { flattenMessages } from './utils';

const messages = {
  es: messages_es,
  en: messages_en,
};

addLocaleData([...en, ...es]);

export default ({ locale, children }) => (
  <IntlProvider
    key={locale || 'en'}
    locale={locale || 'en'}
    messages={flattenMessages(messages[locale || 'en'])}
  >
    {children}
  </IntlProvider>
);
