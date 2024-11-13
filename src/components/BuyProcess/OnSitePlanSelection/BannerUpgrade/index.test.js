import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { BannerUpgrade } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('BannerUpgrade compoment', () => {
  it(`should render BannerUpgrade when currentPlan is undefined`, async () => {
    // Act
    render(
      <IntlProvider>
        <BannerUpgrade />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('onsite_selection.banner_for_prints');
  });

  it(`should render BannerUpgrade when currentPlan is not active`, async () => {
    // Arrange
    const currentPlan = { active: false };

    // Act
    render(
      <IntlProvider>
        <BannerUpgrade currentPlan={currentPlan} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('onsite_selection.banner_for_prints');
  });

  it(`should not render BannerUpgrade when currentPlan is active`, async () => {
    // Arrange
    const currentPlan = { active: true };

    // Act
    const { container } = render(
      <IntlProvider>
        <BannerUpgrade currentPlan={currentPlan} />
      </IntlProvider>,
    );

    // Assert
    expect(container.innerHTML).toBe('');
  });
});
