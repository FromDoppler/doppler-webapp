import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { OverlaySection } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('OverlaySection component', () => {
  it('should render OverlaySection component', async () => {
    // Arrange
    const props = {
      messageKey: 'dashboard.campaigns.overlayMessage',
      textLinkKey: 'dashboard.campaigns.overlayMessageButton',
      urlKey: 'dashboard.first_steps.has_campaings_created_url',
    };

    // Act
    render(
      <IntlProvider>
        <OverlaySection {...props} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText(props.messageKey);
    screen.getByText(props.textLinkKey);
  });
});
