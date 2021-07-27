import React from 'react';
import { ConfirmationMessage } from './ConfirmationMessage';
import { render } from '@testing-library/react';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';

describe('Modal for upgrade confirmation message flow', () => {
  it('renders upgrade popup for monthly by subscribers without errors', async () => {
    // Act
    const { getByText } = render(
      <IntlProvider>
        <ConfirmationMessage isSubscriber={true} amountSubscribers={1}></ConfirmationMessage>
      </IntlProvider>,
    );

    // Assert
    expect(getByText('upgradePlanForm.confirmation_title')).toBeInTheDocument();
    expect(getByText('upgradePlanForm.confirmation_subtitle_contact')).toBeInTheDocument();
  });

  it('renders upgrade popup for monthly by emails without errors', async () => {
    // Act
    const { getByText } = render(
      <IntlProvider>
        <ConfirmationMessage isSubscriber={false} amountSubscribers={1}></ConfirmationMessage>
      </IntlProvider>,
    );

    // Assert
    expect(getByText('upgradePlanForm.confirmation_title')).toBeInTheDocument();
    expect(getByText('upgradePlanForm.confirmation_subtitle_shipping')).toBeInTheDocument();
  });
});
