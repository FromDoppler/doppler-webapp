import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { BannerUpgrade } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('BannerUpgrade compoment', () => {
  it(`should render BannerUpgrade when currentPlan is undefined`, async () => {
    // Arrange
    const messageId = 'onsite_selection.banner_for_prints';

    // Act
    render(
      <IntlProvider>
        <BannerUpgrade messageId={messageId} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText(messageId);
  });

  it(`should render BannerUpgrade when currentPlan is not active`, async () => {
    // Arrange
    const currentPlan = { active: false };
    const messageId = 'onsite_selection.banner_for_prints';

    // Act
    render(
      <IntlProvider>
        <BannerUpgrade currentPlan={currentPlan} messageId={messageId} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText(messageId);
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
