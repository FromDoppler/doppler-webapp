import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import messages_es from './es';
import messages_en from './en';
import { flattenMessages, availableLanguageOrDefault } from './utils';

const messages = {
  es: messages_es,
  en: messages_en,
};

addLocaleData([...en, ...es]);

export default ({ locale, children }) => {
  const sanitizedLocale = availableLanguageOrDefault(locale);
  return (
    <IntlProvider locale={sanitizedLocale} messages={flattenMessages(messages[sanitizedLocale])}>
      {children}
    </IntlProvider>
  );
};
