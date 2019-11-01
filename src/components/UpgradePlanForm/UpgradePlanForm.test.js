import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
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

    //Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerLegacyClient: dopplerLegacyClientDouble,
        }}
      >
        <IntlProvider>
          <UpgradePlanForm />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();

    //Assert
    expect(getByText('upgradePlanForm.title')).toBeInTheDocument();
  });
});
