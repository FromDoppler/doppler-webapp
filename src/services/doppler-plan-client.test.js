import { HardcodedDopplerLegacyClient } from './doppler-legacy-client.doubles';
import { DopplerPlanClient } from './doppler-plan-client';
import { planType, userType } from './doppler-legacy-client';

describe('Doppler plan client', () => {
  it('should validate if call to get data only once', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });
    const spyGetAllPlans = jest.spyOn(dopplerLegacyClient, 'getAllPlans');

    // Act
    await dopplerPlanClient.getPlanData();
    await dopplerPlanClient.getPlanData();

    // Assert
    expect(spyGetAllPlans).toHaveBeenCalledTimes(1);
  });

  it('should get all standard plans monthly by subscribers', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planByType = await dopplerPlanClient.getPlanListByType(
      planType.STANDARD,
      userType.SUBSCRIBERS_MONTHLY,
    );

    // Assert
    expect(planByType.length).toBeGreaterThan(0);
    expect(planByType[0].type).toBe(planType.STANDARD);
    expect(planByType[0].userType).toBe(userType.SUBSCRIBERS_MONTHLY);
  });

  it('should get current plan and plus plan for a high volume plan', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planCompare = await dopplerPlanClient.getFeaturedPlan(12);

    // Assert
    expect(planCompare.length).toBeGreaterThan(0);
    expect(planCompare.find((plan) => plan.type === planType.PLUS));
  });

  it('should get current plan and plus plan for a monthly subscribers plan', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planCompare = await dopplerPlanClient.getFeaturedPlan(18);

    // Assert
    expect(planCompare.length).toBeGreaterThan(0);
    expect(planCompare.find((plan) => plan.type === planType.PLUS));
  });

  it('should get all standard plans of all types', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planByType = await dopplerPlanClient.getPlanListByType(planType.STANDARD);

    // Assert
    expect(planByType.length).toBeGreaterThan(0);
    expect(planByType[0].type).toBe(planType.STANDARD);
  });

  it('should return empty for unexistent plan', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planCompare = await dopplerPlanClient.getFeaturedPlan(200000000);

    // Assert
    expect(planCompare.length).toBe(0);
  });

  it('should return one plan if there is no plus plan for selected plan', async () => {
    // Arrange
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const dopplerPlanClient = new DopplerPlanClient({ dopplerLegacyClient });

    // Act
    const planCompare = await dopplerPlanClient.getFeaturedPlan(19);

    // Assert
    expect(planCompare.length).toBe(1);
  });
});
