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
      type: 'subscribers',
      id: 19,
      name: '3500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 3500,
      fee: 29,
      featureSet: 'standard',
      featureList: [],
    },
    {
      type: 'subscribers',
      id: 19,
      name: '2500-SUBSCRIBERS-STANDARD',
      subscriberLimit: 2500,
      fee: 32,
      featureSet: 'standard',
      featureList: [],
    },
    {
      type: 'subscribers',
      id: 19,
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
    var paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(4);
    expect(paths[0].actual).toBe(true);
    expect(paths[0].deadEnd).toBe(true);
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
    var paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(3);
    expect(paths[0].actual).toBe(true);
    expect(paths[0].deadEnd).toBe(false);
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
    var paths = await planService.getPaths(currentPlan, planList);
    // Assert
    expect(paths.length).toBe(3);
    expect(paths[0].actual).toBe(true);
    expect(paths[0].deadEnd).toBe(false);
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
    var paths = await planService.getPaths(currentPlan, planList);

    // Assert
    expect(paths.length).toBe(2);
    expect(paths[0].actual).toBe(true);
    expect(paths[0].deadEnd).toBe(false);
    expect(paths[0].minimumFee).toBe(currentPlan.fee);
  });
});
