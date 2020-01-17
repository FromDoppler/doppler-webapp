import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HeaderUserMenu from './HeaderUserMenu';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

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
  sms: {
    description: 'Available for SMS',
    remainingCredits: 450,
    buttonText: 'CHARGE',
    buttonUrl: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/GetSmsConfiguration',
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
    // Act
    const { getByText, getAllByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('John Miller')).toBeInTheDocument();
    expect(getByText('john@doppler.com')).toBeInTheDocument();
    expect(getAllByText('JM')).toHaveLength(2);
    expect(getByText('Panel de Control')).toBeInTheDocument();
  });

  it('user have monhtly plan', () => {
    // Arrange
    userData.plan = {
      isMonthlyByEmail: 'true',
      description: 'Remaining Emails',
      planName: 'Monthly Plan',
      maxSubscribers: 50000,
    };

    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('Remaining Emails')).toBeInTheDocument();
    expect(getByText('50000')).toBeInTheDocument();
  });

  it('user is clienManager', () => {
    // Arrange
    userData.plan = {
      clientManager: {},
      buttonUrl: 'https://app2.fromdoppler.com/ControlPanel',
      buttonText: 'Upgrade',
    };

    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText('Upgrade')).toBeInTheDocument();
  });

  it('should show available SMS text when user have SMS enabled', () => {
    // Act
    const { getByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(getByText(userData.sms.description)).toBeInTheDocument();
  });

  it('should not show SMS text when feature is disabled or is not implented yet', () => {
    // Arrange
    userData.sms = {};

    // Act
    const { queryByText } = render(
      <IntlProvider>
        <HeaderUserMenu user={userData} />
      </IntlProvider>,
    );

    // Assert
    expect(queryByText('Available for SMS')).not.toBeInTheDocument();
  });
});
