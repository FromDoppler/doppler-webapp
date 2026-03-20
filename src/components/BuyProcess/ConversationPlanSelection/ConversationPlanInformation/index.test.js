import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ConversationPlanInformation } from '.';

describe('ConversationPlanInformation', () => {
  it('should render ConversationPlanInformation', async () => {
    // Act
    render(
      <IntlProvider>
        <ConversationPlanInformation />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('chat_selection.plan_chat_info.section_1.title');
  });
});
