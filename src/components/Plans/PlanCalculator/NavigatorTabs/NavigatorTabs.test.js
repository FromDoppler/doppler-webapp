import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../../doppler-types';

import { NavigatorTabs } from './NavigatorTabs';

describe('NavigatorTabs Component', () => {
  test('NavigatorTab component render a tab for each planType', () => {
    //Arrange
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const selectedPlanType = PLAN_TYPE.byContact;
    //Act
    render(
      <IntlProvider>
        <Router>
          <NavigatorTabs tabs={planTypes} selectedPlanType={selectedPlanType} />
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
        `/plan-selection/premium/${URL_PLAN_TYPE[planTypes[index]]}`,
      );
    });
  });
});
