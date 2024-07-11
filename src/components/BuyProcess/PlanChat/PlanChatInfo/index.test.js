import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanChatInfo } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanChatInfo', () => {
  it('should render PlanChatInfo', async () => {
    // Act
    render(
      <IntlProvider>
        <PlanChatInfo />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('chat_selection.plan_chat_info.section_1.title');
  });
});
