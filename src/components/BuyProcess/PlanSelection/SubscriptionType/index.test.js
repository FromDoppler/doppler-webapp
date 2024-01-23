import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { SubscriptionType } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('SuscriptionType', () => {
  it(`should render SuscriptionType`, async () => {
    // Act
    render(
      <IntlProvider>
        <SubscriptionType period={3} discountPercentage={5} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('plan_calculator.current_subscription');
    screen.getByText('plan_calculator.subscription_discount');
  });
});
