import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { RadioBox, RadioFooter, RadioTooltip } from '.';
import { fakeAccountPlanDiscounts } from '../../../services/doppler-account-plans-api-client.double';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('RadioBox component', () => {
  it('should render RadioBox component', async () => {
    // Arrange
    const value = fakeAccountPlanDiscounts[1];
    const label = 'Three months';
    const handleClick = jest.fn();

    // Act
    render(
      <IntlProvider>
        <RadioBox
          tooltip={<RadioTooltip discountPercentage={value.discountPercentage} />}
          value={value}
          label={label}
          handleClick={handleClick}
        />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('buy_process.discount_percentage');
    expect(screen.getByRole('radio', { name: label })).not.toBeChecked();
  });

  describe('RadioFooter component', () => {
    it('should render RadioFooter component', async () => {
      // Arrange
      const formattedPrice = 'US$8,00';

      // Act
      render(
        <IntlProvider>
          <RadioFooter price={formattedPrice} />
        </IntlProvider>,
      );

      // Assert
      screen.getByText('buy_process.min_monthly_plan_price');
    });
  });

  describe('RadioTooltip component', () => {
    it('should render RadioTooltip component when has a discount percentage ', async () => {
      // Arrange
      const discountPercentage = 25;

      // Act
      render(
        <IntlProvider>
          <RadioTooltip discountPercentage={discountPercentage} />
        </IntlProvider>,
      );

      // Assert
      screen.getByText('buy_process.discount_percentage');
    });

    it('should render RadioTooltip component when does not has a discount percentage ', async () => {
      // Arrange
      const discountPercentage = 0;

      // Act
      render(
        <IntlProvider>
          <RadioTooltip discountPercentage={discountPercentage} />
        </IntlProvider>,
      );

      // Assert
      expect(screen.queryByText('buy_process.discount_percentage')).not.toBeInTheDocument();
    });
  });
});
