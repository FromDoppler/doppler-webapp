import { allPlans, HardcodedDopplerLegacyClient } from '../doppler-legacy-client.doubles';
import { PlanService } from '.';

describe('Doppler plan client', () => {
  const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
  const planService = new PlanService({ dopplerLegacyClient });

  it('should validate if call to get data only once', async () => {
    // Arrange
    const spyGetAllPlans = jest.spyOn(dopplerLegacyClient, 'getAllPlans');

    // Act
    const plans = await planService.getPlanList();
    await planService.getPlanList();

    // Assert
    expect(spyGetAllPlans).toHaveBeenCalledTimes(1);
    expect(plans).toBe(allPlans);
  });
});
