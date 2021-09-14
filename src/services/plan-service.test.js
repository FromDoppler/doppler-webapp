import { HardcodedDopplerLegacyClient } from './doppler-legacy-client.doubles';
import { PlanService } from './plan-service';

describe('Doppler plan client', () => {
  const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
  const planService = new PlanService({ dopplerLegacyClient });
  const planList = [
    {
      type: 'prepaid',
      id: 1,
      name: '1500-CREDITS',
      credits: 1500,
      price: 15,
      featureSet: 'standard',
    },
    {
      type: 'prepaid',
      id: 3,
      name: '5000-CREDITS',
      credits: 5000,
      price: 85,
      featureSet: 'standard',
    },
    {
      type: 'monthly-deliveries',
      id: 11,
      name: '700000-EMAILS-STANDARD',
      emailsByMonth: 700000,
      extraEmailPrice: 0.00087,
      fee: 610,
      featureSet: 'standard',
      features: [],
    },
    {
      type: 'monthly-deliveries',
      id: 11,
      name: '800000-EMAILS-STANDARD',
      emailsByMonth: 800000,
      extraEmailPrice: 0.00087,
      fee: 710,
      featureSet: 'standard',
      features: [],
    },
    {
      type: 'monthly-deliveries',
      id: 12,
      name: '700000-EMAILS-STANDARD',
      emailsByMonth: 700000,
      extraEmailPrice: 0.00087,
      fee: 1000,
      featureSet: 'plus',
      features: [],
    },
    {
      type: 'subscribers',
      id: 19,
      name: '3500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 3500,
      fee: 45,
      featureSet: 'standard',
      featureList: [],
    },
    {
      type: 'subscribers',
      id: 20,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
    },
    {
      type: 'subscribers',
      id: 21,
      name: '2500-SUBSCRIBERS-PLUS',
      subscriberLimit: 2500,
      fee: 290,
      featureSet: 'plus',
      featureList: [],
    },
  ];

  it('should validate if call to get data only once', async () => {
    // Arrange
    const spyGetAllPlans = jest.spyOn(dopplerLegacyClient, 'getAllPlans');

    // Act
    await planService.getPlanList();
    await planService.getPlanList();

    // Assert
    expect(spyGetAllPlans).toHaveBeenCalledTimes(1);
  });

  it('should get correct path for a current free user', async () => {
    // Arrange
    const currentPlan = {
      type: 'free',
      subscriberLimit: 500,
      featureSet: 'free',
    };

    // Act
    const paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(4);
    expect(paths[0].current).toBe(true);
    expect(paths.filter((plan) => plan.current).length > 0);
  });

  it('should get correct path for a current prepaid user', async () => {
    // Arrange
    const currentPlan = {
      type: 'prepaid',
      id: 2,
      name: '2500-CREDITS',
      credits: 2500,
      price: 45,
      featureSet: 'standard',
    };

    // Act
    const paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(3);
    expect(paths[0].current).toBe(true);
  });

  it('should get correct path for a current subscriber standard user', async () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 19,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 29,
      featureSet: 'standard',
      featureList: [],
      billingCycleDetails: [
        { id: 8, idPlan: 19, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      ],
    };

    // Act
    const paths = await planService.getPaths(currentPlan, planList);
    // Assert
    expect(paths.length).toBe(3);
    expect(paths[0].current).toBe(true);
  });

  it('should get correct path for a current subscriber plus user', async () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 19,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 29,
      featureSet: 'plus',
      featureList: [],
      billingCycleDetails: [
        { id: 8, idPlan: 19, paymentType: 'CC', discountPercentage: 0, billingCycle: 'monthly' },
      ],
    };

    // Act
    const paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(2);
    expect(paths[0].current).toBe(true);
    expect(paths[0].minimumFee).toBe(currentPlan.fee);
  });

  // get plan types

  it('should get correct types for free user - selected path standard', async () => {
    // Arrange
    const currentPlan = {
      type: 'free',
      subscriberLimit: 500,
      featureSet: 'free',
    };

    // Act
    const types = await planService.getPlanTypes(currentPlan, 'standard', planList);

    // Assert
    expect(types.length).toBe(3);
  });

  it('should get correct types for free user - selected path plus', async () => {
    // Arrange
    const currentPlan = {
      type: 'free',
      subscriberLimit: 500,
      featureSet: 'free',
    };

    // Act
    const types = await planService.getPlanTypes(currentPlan, 'plus', planList);

    // Assert
    expect(types.length).toBe(2);
  });

  it('should get correct types for prepaid user - selected path standard', async () => {
    // Arrange
    const currentPlan = {
      type: 'prepaid',
      id: 1,
      name: '1500-CREDITS',
      credits: 1500,
      price: 15,
      featureSet: 'standard',
    };

    // Act
    const types = await planService.getPlanTypes(currentPlan, 'standard', planList);

    // Assert
    expect(types.length).toBe(3);
  });

  it('should get correct types for subscriber user - selected path standard', () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 20,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
      currentSubscription: 1,
    };

    // Act
    const types = planService.getPlanTypes(currentPlan, 'standard', planList);

    // Assert
    expect(types.length).toBe(2);
  });

  it('should get correct types for subscriber user - standard subscription > 1 month', () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 20,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
      currentSubscription: 3,
    };

    // Act
    const types = planService.getPlanTypes(currentPlan, 'standard', planList);

    // Assert
    expect(types.length).toBe(1);
  });

  it('should get correct types for monthly user - selected path standard', () => {
    // Arrange
    const currentPlan = {
      type: 'monthly-deliveries',
      id: 11,
      name: '700000-EMAILS-STANDARD',
      emailsByMonth: 700000,
      extraEmailPrice: 0.00087,
      fee: 610,
      featureSet: 'standard',
      features: [],
    };

    // Act
    const types = planService.getPlanTypes(currentPlan, 'standard', planList);

    // Assert
    expect(types.length).toBe(1);
  });

  it('should get correct plans for free user - selected path plus, type subscribers', async () => {
    // Arrange
    const currentPlan = {
      type: 'free',
      subscriberLimit: 500,
      featureSet: 'free',
    };

    // Act
    const plans = await planService.getPlans(currentPlan, 'plus', 'subscribers', planList);

    // Assert
    expect(plans.length).toBeGreaterThan(0);
    expect(plans.length).toBe(
      planList.filter((plan) => plan.type === 'subscribers' && plan.featureSet === 'plus').length,
    );
  });

  it('should get correct plans: prepaid user - path: standard - type: monthly', async () => {
    // Arrange
    const currentPlan = {
      type: 'prepaid',
      id: 1,
      name: '1500-CREDITS',
      credits: 1500,
      price: 15,
      featureSet: 'standard',
    };

    // Act
    const plans = await planService.getPlans(
      currentPlan,
      'standard',
      'monthly-deliveries',
      planList,
    );

    // Assert
    expect(plans.length).toBeGreaterThan(0);
    expect(plans.length).toBe(
      planList.filter(
        (plan) => plan.type === 'monthly-deliveries' && plan.featureSet === 'standard',
      ).length,
    );
  });

  it('should get plans for user: monthly - path: standard - type: monthly', async () => {
    // Arrange
    const currentPlan = {
      type: 'monthly-deliveries',
      id: 11,
      name: '700000-EMAILS-STANDARD',
      emailsByMonth: 700000,
      extraEmailPrice: 0.00087,
      fee: 610,
      featureSet: 'standard',
      features: [],
    };

    // Act
    const plans = await planService.getPlans(
      currentPlan,
      'standard',
      'monthly-deliveries',
      planList,
    );

    // Assert
    expect(plans.length).toBeGreaterThan(0);
  });

  it('should get no subscriber plans when user type: monthly-deliveries', async () => {
    // Arrange
    const currentPlan = {
      type: 'monthly-deliveries',
      id: 11,
      name: '700000-EMAILS-STANDARD',
      emailsByMonth: 700000,
      extraEmailPrice: 0.00087,
      fee: 610,
      featureSet: 'standard',
      features: [],
    };

    // Act
    const plans = await planService.getPlans(currentPlan, 'standard', 'subscribers', planList);

    // Assert
    expect(plans.length).toBe(0);
  });

  it('should get plans for subscriber user - selected path standard and type monthly', () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 20,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
      currentSubscription: 1,
    };

    // Act
    var plans = planService.getPlans(currentPlan, 'standard', 'monthly-deliveries', planList);

    // Assert
    expect(plans.length).toBeGreaterThan(0);
  });

  it('should get plansfor subscriber user - selected path standard and type subscribers', () => {
    // Arrange
    const currentPlan = {
      type: 'subscribers',
      id: 20,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
    };

    // Act
    var plans = planService.getPlans(currentPlan, 'standard', 'subscribers', planList);

    // Assert
    expect(plans.length).toBeGreaterThan(0);
  });
});
