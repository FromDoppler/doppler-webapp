import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { NavigationTabs } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { MemoryRouter as Router } from 'react-router-dom';

const planTypes = [
  {
    type: PLAN_TYPE.byContact,
    minPrice: 8,
    info: 'buy_process.plan_selection.plan_type_subscribers_info',
  },
  {
    type: PLAN_TYPE.byEmail,
    minPrice: 134,
    info: 'buy_process.plan_selection.plan_type_monthly_deliveries_info',
  },
  {
    type: PLAN_TYPE.byCredit,
    minPrice: 23,
    info: 'buy_process.plan_selection.plan_type_prepaid_info',
  },
];
const searchQueryParams = '?promo-code=FAKE_VALUE';

describe('NavigationTabs component', () => {
  it('should component render a tab for each planType', async () => {
    // Arrange
    const selectedPlanType = PLAN_TYPE.byEmail;

    // Act
    render(
      <IntlProvider>
        <Router
          initialEntries={[
            `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${searchQueryParams}`,
          ]}
        >
          <NavigationTabs
            planTypes={planTypes}
            selectedPlanType={selectedPlanType}
            searchQueryParams={searchQueryParams}
          />
        </Router>
      </IntlProvider>,
    );

    // Assert
    const allTabs = screen.queryAllByRole('listitem');
    expect(allTabs.length).toBe(planTypes.length);

    const links = screen.getAllByRole('link');

    links.forEach((link, index) => {
      expect(link).toHaveAttribute(
        'href',
        `/plan-selection/premium/${URL_PLAN_TYPE[planTypes[index].type]}${searchQueryParams}`,
      );
    });

    const radioButtons = screen.getAllByRole('radio');
    radioButtons.forEach((radioButton) => {
      if (radioButton.value === PLAN_TYPE.byEmail) {
        expect(radioButton).toHaveAttribute('checked', '');
      } else {
        expect(radioButton).not.toHaveAttribute('checked', '');
      }
    });
  });
});
