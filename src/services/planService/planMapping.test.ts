import { ACCOUNT } from '../../doppler-types';
import { getBillingCycleDetails, mapAdvancePay, parsePlan } from './planMapping';

const discounts: Array<any> = [
  {
    IdDiscountPlan: 1,
    paymentType: 'transfer',
    IdPaymentMethod: 3,
    DiscountPlanFee: 5,
    MonthPlan: 6,
  },
  {
    IdDiscountPlan: 2,
    paymentType: 'CC',
    IdPaymentMethod: 1,
    DiscountPlanFee: 15,
    MonthPlan: 6,
  },
];

describe.each([
  [
    'should to return a parsed "plan by email"',
    {
      IdUserTypePlan: 1,
      Fee: 10,
      IdUserType: 2,
      EmailQty: 1000,
      ExtraEmailCost: 0.1,
    },
    {
      type: ACCOUNT.byEmail,
      id: 1,
      name: `${1000}-EMAILS`,
      emailsByMonth: 1000,
      extraEmailPrice: 0.1,
      fee: 10,
    },
  ],
  [
    'should to return a parsed "plan by contact"',
    {
      IdUserTypePlan: 2,
      Fee: 15,
      IdUserType: 4,
      EmailQty: 1000,
      ExtraEmailCost: 0.1,
      SubscribersQty: 1500,
      DiscountXPlan: [],
    },
    {
      type: ACCOUNT.byContact,
      id: 2,
      name: `${1500}-SUBSCRIBERS`,
      subscriberLimit: 1500,
      fee: 15,
      billingCycleDetails: [],
    },
  ],
  [
    'should to return a parsed "plan by credit"',
    {
      IdUserTypePlan: 3,
      Fee: 20,
      IdUserType: 3,
      EmailQty: 1000,
      ExtraEmailCost: 0.1,
    },
    {
      type: ACCOUNT.byCredit,
      id: 3,
      name: `${1000}-CREDITS`,
      credits: 1000,
      extraEmailPrice: 0.1,
      price: 20,
    },
  ],
])('parsePlan', (testName, plan, expectedMappedPlan) => {
  it(testName, () => {
    // Act
    const mappedPlan = parsePlan(plan);

    // Assert
    expect(mappedPlan).toEqual(expectedMappedPlan);
  });
});

describe('mapAdvancePay', () => {
  it('should return a mapped discount', () => {
    // Arrange
    const initialDiscount = discounts[1];
    const mappedDiscount = {
      id: 2,
      paymentType: 'CC',
      discountPercentage: 15,
      billingCycle: 'half-yearly',
    };

    // Act
    const discount = mapAdvancePay(initialDiscount);

    // Assert
    expect(discount).toEqual(mappedDiscount);
  });
});

describe('getBillingCycleDetails', () => {
  it('should return an empty array when there are no discounts', () => {
    // Arrange
    const discounts: Array<any> = [];

    // Act
    const billingCycleDetails = getBillingCycleDetails(discounts);

    // Assert
    expect(billingCycleDetails).toEqual([]);
  });

  it('should return the discounts applied to the credit card', () => {
    // Arrange
    const expected: Array<any> = [
      {
        id: 2,
        paymentType: 'CC',
        discountPercentage: 15,
        billingCycle: 'half-yearly',
      },
    ];

    // Act
    const billingCycleDetails = getBillingCycleDetails(discounts);

    // Assert
    expect(billingCycleDetails).toEqual(expected);
  });
});
