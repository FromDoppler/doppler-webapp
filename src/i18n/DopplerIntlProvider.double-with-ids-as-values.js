import React from 'react';
import { IntlProvider } from 'react-intl';
import messages_en from './en';
import { flattenMessages } from './utils';

const messages = Object.keys(flattenMessages(messages_en)).reduce(
  (accumulator, currentValue) => ({ ...accumulator, [currentValue]: currentValue }),
  {},
);

export default ({ children }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);
