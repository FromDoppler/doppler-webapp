import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getPlanFee } from '../../../../../utils';
import { PLAN_TYPE } from '../../../../../doppler-types';
import { allPlans } from '../../../../../services/doppler-legacy-client.doubles';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { PricePerMonth } from '.';

describe('PricePerMonth component', () => {
  test(`Show correct price when plan type is ${PLAN_TYPE.byContact} and subscription is half-yearly`, () => {
    //Arrange
    const plansByType = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
    const myFakePlan = plansByType[0];
    const myFakePlanDetails = myFakePlan.billingCycleDetails.find(
      (details) => details.billingCycle === 'half-yearly',
    );
    //Act
    const fee = getPlanFee(myFakePlan);
    const planFeeWithDiscount = fee * (1 - myFakePlanDetails.discountPercentage / 100);

    render(
      <IntlProvider>
        <PricePerMonth
          selectedPlan={myFakePlan}
          discountPercentage={myFakePlanDetails.discountPercentage}
        />
      </IntlProvider>,
    );
    //Assert
    expect(screen.getByText(planFeeWithDiscount.toString())).toBeInTheDocument();
  });
});
