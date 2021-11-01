import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Slider } from '.';
import { PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Slider Component', () => {
  it('Should render Slider component when the plan is 2,500 contacts', () => {
    //Arrange
    const planType = PLAN_TYPE.byContact;
    const values = [500, 2500, 5000, 7500, 10000];
    const selectedPlanIndex = 1;

    //Act
    render(
      <IntlProvider>
        <Slider
          planType={planType}
          values={values}
          selectedPlanIndex={selectedPlanIndex}
          handleChange={() => null}
        />
      </IntlProvider>,
    );

    //Assert
    expect(screen.getByText('2,500')).toBeInTheDocument();
    expect(
      screen.getByText(`plans.${planType.replace('-', '_')}_amount_description`),
    ).toBeInTheDocument();
  });

  it('Should render Slider component when the plan is 1,500 credits', async () => {
    //Arrange
    const planType = PLAN_TYPE.byCredit;
    const values = [1500, 2500, 5000, 10000];
    const selectedPlanIndex = 0;

    //Act
    const { container } = render(
      <IntlProvider>
        <Slider
          planType={planType}
          values={values}
          selectedPlanIndex={selectedPlanIndex}
          handleChange={() => null}
        />
      </IntlProvider>,
    );

    //Assert
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(
      screen.getByText(`plans.${planType.replace('-', '_')}_amount_description`),
    ).toBeInTheDocument();
  });
});
