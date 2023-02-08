import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import UpgradePlanForm from './UpgradePlanForm';
import { AppServicesProvider } from '../../services/pure-di';

describe('Upgrade plan form component', () => {
  afterEach(cleanup);

  it('renders upgrade popup for monthly subscribers without errors', async () => {
    //Arrange
    const dopplerLegacyClientDouble = {
      getUpgradePlanData: async () => {
        return [
          {
            IdUserTypePlan: 1,
            Description: 'Plan 1 Descripción',
            EmailQty: 12345,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: 456,
          },
          {
            IdUserTypePlan: 2,
            Description: 'Plan 2 Descripción',
            EmailQty: null,
            Fee: 678.9,
            ExtraEmailCost: null,
            SubscribersQty: 456,
          },
          {
            IdUserTypePlan: 3,
            Description: 'Plan 3 Descripción',
            EmailQty: 12345,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: null,
          },
        ];
      },
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isSubscribers: true,
                maxSubscribers: 4,
              },
            },
          },
        },
      },
    };

    //Act
    const { findByText } = render(
      <AppServicesProvider
        forcedServices={{
          ...dependencies,
          dopplerLegacyClient: dopplerLegacyClientDouble,
        }}
      >
        <IntlProvider>
          <UpgradePlanForm />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitFor(() => {});

    //Assert
    expect(await findByText('upgradePlanForm.title')).toBeInTheDocument();
  });

  it('renders upgrade popup for monthly subscribers without selector because the user has the last plan', async () => {
    //Arrange
    const dopplerLegacyClientDouble = {
      getUpgradePlanData: async () => {
        return [
          {
            IdUserTypePlan: 1,
            Description: 'Plan 1 Descripción',
            EmailQty: 12345,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: 3,
          },
          {
            IdUserTypePlan: 2,
            Description: 'Plan 2 Descripción',
            EmailQty: null,
            Fee: 678.9,
            ExtraEmailCost: null,
            SubscribersQty: 2,
          },
          {
            IdUserTypePlan: 3,
            Description: 'Plan 3 Descripción',
            EmailQty: 12345,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: 1,
          },
        ];
      },
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isSubscribers: true,
                maxSubscribers: 4,
              },
            },
          },
        },
      },
    };

    //Act
    const { container } = render(
      <AppServicesProvider
        forcedServices={{
          ...dependencies,
          dopplerLegacyClient: dopplerLegacyClientDouble,
        }}
      >
        <IntlProvider>
          <UpgradePlanForm />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitFor(() => {});

    //Assert
    expect(container.querySelector('.dropdown-arrow')).toBeNull();
  });

  it('renders upgrade popup for monthly emails without selector because the user has the last plan', async () => {
    //Arrange
    const dopplerLegacyClientDouble = {
      getUpgradePlanData: async () => {
        return [
          {
            IdUserTypePlan: 1,
            Description: 'Plan 1 Descripción',
            EmailQty: 3,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: 33,
          },
          {
            IdUserTypePlan: 2,
            Description: 'Plan 2 Descripción',
            EmailQty: 2,
            Fee: 678.9,
            ExtraEmailCost: null,
            SubscribersQty: 22,
          },
          {
            IdUserTypePlan: 3,
            Description: 'Plan 3 Descripción',
            EmailQty: 1,
            Fee: 678.9,
            ExtraEmailCost: 0.0123,
            SubscribersQty: 221,
          },
        ];
      },
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isSubscribers: false,
                maxSubscribers: 4,
              },
            },
          },
        },
      },
    };

    //Act
    const { container } = render(
      <AppServicesProvider
        forcedServices={{
          ...dependencies,
          dopplerLegacyClient: dopplerLegacyClientDouble,
        }}
      >
        <IntlProvider>
          <UpgradePlanForm />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitFor(() => {});

    //Assert
    expect(container.querySelector('.dropdown-arrow')).toBeNull();
  });
});
