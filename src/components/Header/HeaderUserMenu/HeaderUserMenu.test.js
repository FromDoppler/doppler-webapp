import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { flattenMessages } from '../../../utils';

import HeaderUserMenu from './HeaderUserMenu';

import { IntlProvider } from 'react-intl';
import messages_es from '../../../i18n/es.json';
import messages_en from '../../../i18n/en.json';

const messages = {
  es: messages_es,
  en: messages_en,
};

const userData = {
  fullname: 'John Miller',
  email: 'john@doppler.com',
  avatar: {
    color: '#fff',
    text: 'JM',
  },
  plan: {
    remainingCredits: 10000,
    description: 'creditos disponibles',
  },
  nav: [
    {
      title: 'Panel de Control',
      url: 'https://app2.fromdoppler.com/ControlPanel',
      isEnabled: false,
      isSelected: false,
    },
  ],
};

describe('Header user menu', () => {
  afterEach(cleanup);

  it('renders user menu and display user data', () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={flattenMessages(messages['en'])}>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );
    expect(getByText('John Miller')).toBeInTheDocument();
    expect(getByText('john@doppler.com')).toBeInTheDocument();
    expect(getByText('JM')).toBeInTheDocument();
    expect(getByText('Panel de Control')).toBeInTheDocument();
  });

  it('user have monhtly plan', () => {
    userData.plan = {
      isMonthlyByEmail: 'true',
      description: 'Remaining Emails',
      planName: 'Monthly Plan',
      maxSubscribers: 50000,
    };

    const { getByText } = render(
      <IntlProvider locale="en" messages={flattenMessages(messages['en'])}>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );
    expect(getByText('Remaining Emails')).toBeInTheDocument();
    expect(getByText('50000')).toBeInTheDocument();
  });

  it('user is clienManager', () => {
    userData.plan = {
      clientManager: {},
      buttonUrl: 'https://app2.fromdoppler.com/ControlPanel',
      buttonText: 'Upgrade',
    };

    const { getByText } = render(
      <IntlProvider locale="en" messages={flattenMessages(messages['en'])}>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );
    expect(getByText('Upgrade')).toBeInTheDocument();
  });
});
