import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import messages_en from './en.json';
import { flattenMessages } from '../utils';

addLocaleData([...en]);

const messages = Object.keys(flattenMessages(messages_en)).reduce(
  (accumulator, currentValue) => ({ ...accumulator, [currentValue]: currentValue }),
  {},
);

export default ({ children }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);
