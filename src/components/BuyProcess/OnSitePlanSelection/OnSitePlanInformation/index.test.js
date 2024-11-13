import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { OnSitePlanInformation } from '.';

describe('OnSitePlanInformation', () => {
  it('should render OnSitePlanInformation', async () => {
    // Act
    render(
      <IntlProvider>
        <OnSitePlanInformation />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('onsite_selection.onsite_plan_info.section_1.title');
  });
});
