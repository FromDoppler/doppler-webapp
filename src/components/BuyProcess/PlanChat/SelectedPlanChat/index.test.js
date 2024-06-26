import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { SelectedPlanChat } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('SelectedPlanChat', () => {
  it('should render SelectedPlanChat', async () => {
    // Arrange
    const seletedPlanChat = {
      planId: 1,
      conversationsQty: 500,
      agents: 1,
      channels: 4,
      fee: 30,
    };

    // Act
    render(
      <IntlProvider>
        <SelectedPlanChat selectedPlan={seletedPlanChat} />
      </IntlProvider>,
    );
  });
});
