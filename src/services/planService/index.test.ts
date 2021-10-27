import { allPlans, HardcodedDopplerLegacyClient } from '../doppler-legacy-client.doubles';
import { agenciesPlan, exclusivePlan, freePlan, getCheaperPlan, PlanService } from '.';
import { PLAN_TYPE } from '../../doppler-types';

describe('planService', () => {
  it('should validate if call to get data only once', async () => {
    // Arrange
    const appSessionRef = null;
    const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
    const spyGetAllPlans = jest.spyOn(dopplerLegacyClient, 'getAllPlans');

    // Act
    const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
    const plans = await planService.getPlanList();
    await planService.getPlanList();

    // Assert
    expect(spyGetAllPlans).toHaveBeenCalledTimes(1);
    expect(plans).toBe(allPlans);
  });

  describe('getCurrentPlan method', () => {
    const getAppSessionRef = (plan: any) => ({
      current: {
        userData: {
          user: {
            plan,
          },
        },
      },
    });

    it('should return free plan', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.free });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      await planService.getPlanList();
      const currentPlan = planService.getCurrentPlan();

      // Assert
      expect(currentPlan).toBe(freePlan);
    });

    it('should return agencies plan', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.agencies });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      await planService.getPlanList();
      const currentPlan = planService.getCurrentPlan();

      // Assert
      expect(currentPlan).toBe(agenciesPlan);
    });

    it('should return exclusive plan', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        planType: PLAN_TYPE.byContact,
        idPlan: -1, // not found idPlan in PlanList
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      await planService.getPlanList();
      const currentPlan = planService.getCurrentPlan();

      // Assert
      expect(currentPlan).toBe(exclusivePlan);
    });

    it('should return plan by contacts', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      // search first plan by contact
      const planByContact = allPlans.find((plan) => (plan.type = 'subscribers'));
      const subscription = 'monthly';
      const appSessionRef = getAppSessionRef({
        idPlan: planByContact?.id,
        planType: PLAN_TYPE.byContact,
        planSubscription: subscription,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      await planService.getPlanList();
      const currentPlan = planService.getCurrentPlan();

      // Assert
      expect(currentPlan).toEqual({ ...planByContact, currentSubscription: subscription });
    });

    it('should return plan by emails', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      // search first plan by email
      const planByEmail = allPlans.find((plan) => (plan.type = 'monthly-deliveries'));
      const appSessionRef = getAppSessionRef({
        idPlan: planByEmail?.id,
        planType: PLAN_TYPE.byEmail,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      await planService.getPlanList();
      const currentPlan = planService.getCurrentPlan();

      // Assert
      expect(currentPlan).toEqual(planByEmail);
    });
  });
});

describe('getCheaperPlan function', () => {
  it('should sort plan by credit', async () => {
    // Arrange
    const planType = PLAN_TYPE.byCredit;
    const planList = [
      {
        type: PLAN_TYPE.byCredit,
        price: 45,
      },
      {
        type: PLAN_TYPE.byCredit,
        price: 15,
      },
      {
        type: PLAN_TYPE.byCredit,
        price: 85,
      },
    ];

    // Act
    const cheaperPlan = getCheaperPlan(planType, planList);

    // Assert
    expect(cheaperPlan).toEqual({
      type: PLAN_TYPE.byCredit,
      price: 15,
    });
  });
});
