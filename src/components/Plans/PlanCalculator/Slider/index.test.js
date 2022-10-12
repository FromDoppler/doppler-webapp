import '@testing-library/jest-dom/extend-expect';
import { getByText, queryByText, render, screen } from '@testing-library/react';
import { Slider, Tickmarks } from '.';
import { PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { compactNumber } from '../../../../utils';

describe('Slider Component', () => {
  it('Should render Slider component when the plan is 2,500 contacts', () => {
    //Arrange
    const planType = PLAN_TYPE.byContact;
    const values = [500, 2500, 5000, 7500, 10000];
    const selectedPlanIndex = 1;
    const promotion = {
      isValid: true,
    };

    //Act
    render(
      <IntlProvider>
        <Slider
          planType={planType}
          values={values}
          selectedPlanIndex={selectedPlanIndex}
          handleChange={() => null}
          promotion={promotion}
        />
      </IntlProvider>,
    );

    //Assert
    expect(screen.getByText('2,500')).toBeInTheDocument();
    expect(
      screen.getByText(`plans.${planType.replace('-', '_')}_amount_description`),
    ).toBeInTheDocument();
    // don't apply promocode because plan type is by contacts
    expect(screen.queryByTestId('old-credits')).not.toBeInTheDocument();
  });

  it('Should render Slider component when the plan is 1,500 credits', async () => {
    //Arrange
    const planType = PLAN_TYPE.byCredit;
    const values = [1500, 2500, 5000, 10000];
    const selectedPlanIndex = 0;
    const promotion = {
      isValid: true,
      extraCredits: 1500,
    };

    //Act
    render(
      <IntlProvider>
        <Slider
          planType={planType}
          values={values}
          selectedPlanIndex={selectedPlanIndex}
          handleChange={() => null}
          promotion={promotion}
        />
      </IntlProvider>,
    );

    //Assert
    // this is the quantity credits (without extra credits)
    expect(screen.getByTestId('old-credits')).toBeInTheDocument();
    expect(screen.getByText(/1,500/i)).toBeInTheDocument();
    expect(
      screen.getByText(`plans.${planType.replace('-', '_')}_amount_description`),
    ).toBeInTheDocument();
    expect(screen.getByText(/3,000/i)).toBeInTheDocument();
  });

  it('Should hide the Slider when isVisible is true', async () => {
    //Arrange
    const planType = PLAN_TYPE.byCredit;
    const values = [10000];
    const selectedPlanIndex = 0;
    const promotion = {
      isValid: false,
    };

    //Act
    const { container } = render(
      <IntlProvider>
        <Slider
          isVisible={false}
          planType={planType}
          values={values}
          selectedPlanIndex={selectedPlanIndex}
          handleChange={() => null}
          promotion={promotion}
        />
      </IntlProvider>,
    );

    //Assert
    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(
      screen.getByText(`plans.${planType.replace('-', '_')}_amount_description`),
    ).toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    // don't apply promocode because the promotion it isn't valid
    expect(screen.queryByTestId('old-credits')).not.toBeInTheDocument();
  });

  it(`should show the marks when amount plans is less than hideMarksFrom`, async () => {
    //Arrange
    const values = [1000, 2000, 5000, 100000];
    const amountPlans = values.length;
    const handleChange = jest.fn();

    //Act
    render(
      <Tickmarks
        id="item-list"
        values={values}
        amountPlans={amountPlans}
        handleChange={handleChange}
      />,
    );

    //Assert
    screen.getByRole('list');
    const listitems = screen.getAllByRole('listitem');

    listitems.forEach((listitem, index) => {
      getByText(listitem, compactNumber(values[index]));
    });
  });

  it(`should hide the marks when amount plans is greater than or equal to hideMarksFrom`, async () => {
    //Arrange
    const values = [1000, 2000, 5000, 100000];
    const amountPlans = values.length;
    const handleChange = jest.fn();

    //Act
    render(
      <Tickmarks
        id="item-list"
        values={values}
        amountPlans={amountPlans}
        handleChange={handleChange}
        hideMarksFrom={3}
      />,
    );

    //Assert
    screen.getByRole('list');
    const listitems = screen.getAllByRole('listitem');
    expect(listitems).toHaveLength(amountPlans);

    listitems.forEach((listitem, index) => {
      [0, amountPlans - 1].includes(index)
        ? getByText(listitem, compactNumber(values[index]))
        : expect(queryByText(listitem, compactNumber(values[index]))).not.toBeInTheDocument();
    });
  });
});
