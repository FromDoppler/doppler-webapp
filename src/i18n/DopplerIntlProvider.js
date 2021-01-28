import React from 'react';
import { IntlProvider } from 'react-intl';
import messages_es from './es';
import messages_en from './en';
import { flattenMessages, availableLanguageOrDefault } from './utils';

const messages = {
  es: messages_es,
  en: messages_en,
};

const DopplerIntlProvider = ({ locale, children }) => {
  const sanitizedLocale = availableLanguageOrDefault(locale);
  return (
    <IntlProvider
      locale={sanitizedLocale}
      defaultLocale={locale}
      messages={flattenMessages(messages[sanitizedLocale])}
    >
      {children}
    </IntlProvider>
  );
};

export default DopplerIntlProvider;
