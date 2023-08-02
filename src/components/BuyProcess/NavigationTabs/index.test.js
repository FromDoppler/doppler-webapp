import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import NavigationTabs from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { MemoryRouter as Router } from 'react-router-dom';

const planTypes = [
  { type: PLAN_TYPE.byContact, minPrice: 8 },
  { type: PLAN_TYPE.byEmail, minPrice: 134 },
  { type: PLAN_TYPE.byCredit, minPrice: 23 },
];

describe('NavigationTabs component', () => {
  it('should component render a tab for each planType', async () => {
    // Arrange
    const selectedPlanType = PLAN_TYPE.byContact;

    // Act
    render(
      <IntlProvider>
        <Router>
          <NavigationTabs planTypes={planTypes} selectedPlanType={selectedPlanType} />
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
        `/plan-selection/premium/${URL_PLAN_TYPE[planTypes[index].type]}`,
      );
    });
  });

  it('should render a tab for each planType with query params', () => {
    //Arrange
    const selectedPlanType = PLAN_TYPE.byContact;
    const search = '?origin=hello_bar&promo-code=fake-promo-code';

    //Act
    render(
      <IntlProvider>
        <Router
          initialEntries={[
            `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${search}`,
          ]}
        >
          <NavigationTabs planTypes={planTypes} selectedPlanType={selectedPlanType} />
        </Router>
      </IntlProvider>,
    );

    //Assert
    const allTabs = screen.queryAllByRole('listitem');
    expect(allTabs.length).toBe(planTypes.length);

    const links = screen.getAllByRole('link');

    links.forEach((link, index) => {
      expect(link).toHaveAttribute(
        'href',
        `/plan-selection/premium/${URL_PLAN_TYPE[planTypes[index].type]}${search}`,
      );
    });
  });
});
