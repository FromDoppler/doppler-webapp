import { allPlans, HardcodedDopplerLegacyClient } from '../doppler-legacy-client.doubles';
import { agenciesPlan, exclusivePlan, freePlan, getCheaperPlan, PlanService } from '.';
import { PLAN_TYPE } from '../../doppler-types';
import { firstPlansDefaultOrder } from '../../utils';

describe('planService', () => {
  const getAppSessionRef = (plan: any) => ({
    current: {
      userData: {
        user: {
          plan,
        },
      },
    },
  });

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

  describe.each([
    ['should return only plans by contacts when planType is by contacts', PLAN_TYPE.byContact],
    ['should return only plans by emails when planType is by emails', PLAN_TYPE.byEmail],
    ['should return only plans by credits when planType is by credits', PLAN_TYPE.byCredit],
  ])('getPlansByType method', (testName, planType) => {
    it(testName, async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.free });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const plansByType = await planService.getPlansByType(planType);

      // Assert
      expect(plansByType).toEqual(allPlans.filter((plan) => plan.type === planType));
    });
  });

  describe('getPlanTypes method', () => {
    it('should return plans by credit, email and contact when the plan is free', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.free });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getPlanTypes();

      // Assert
      expect(orderPlanTypes).toEqual(firstPlansDefaultOrder);
    });

    it('should return plan by email when the plan is email', async () => {
      // Arrange
      const planByEmail = allPlans.find((plan) => plan.type === PLAN_TYPE.byEmail);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByEmail?.id,
        planType: PLAN_TYPE.byEmail,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getPlanTypes();

      // Assert
      expect(orderPlanTypes).toEqual([PLAN_TYPE.byEmail]);
    });

    it('should return plans by credit when the plan is credit', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.byCredit, subscribersCount: 0 });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getPlanTypes();

      // Assert
      expect(orderPlanTypes).toEqual([PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit]);
    });

    it('should return plans by contact when the plan is contact', async () => {
      // Arrange
      const planByContact = allPlans.find((plan) => plan.type === PLAN_TYPE.byContact);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByContact?.id,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getPlanTypes();

      // Assert
      expect(orderPlanTypes).toEqual([PLAN_TYPE.byContact]);
    });

    it('should return plan by contact when the plan is contact and annual', async () => {
      // Arrange
      const planByContact = allPlans.find((plan) => plan.type === PLAN_TYPE.byContact);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByContact?.id,
        planType: PLAN_TYPE.byContact,
        planSubscription: 12,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getPlanTypes();

      // Assert
      expect(orderPlanTypes).toEqual([PLAN_TYPE.byContact]);
    });
  });

  describe('getDistinctPlans method', () => {
    it('should return plans by credit, email and contact when the plan is free', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.free });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getDistinctPlans();

      // Assert
      expect(orderPlanTypes.map((distinctPlan) => distinctPlan.type)).toEqual(
        firstPlansDefaultOrder,
      );
    });

    it('should return plan by email when the plan is email', async () => {
      // Arrange
      const planByEmail = allPlans.find((plan) => plan.type === PLAN_TYPE.byEmail);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByEmail?.id,
        planType: PLAN_TYPE.byEmail,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getDistinctPlans();

      // Assert
      expect(orderPlanTypes.map((distinctPlan) => distinctPlan.type)).toEqual([PLAN_TYPE.byEmail]);
    });

    it('should return plans by credit when the plan is credit', async () => {
      // Arrange
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({ planType: PLAN_TYPE.byCredit, subscribersCount: 0 });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getDistinctPlans();

      // Assert
      expect(orderPlanTypes.map((distinctPlan) => distinctPlan.type)).toEqual([
        PLAN_TYPE.byContact,
        PLAN_TYPE.byEmail,
        PLAN_TYPE.byCredit,
      ]);
    });

    it('should return plans by contact when the plan is contact', async () => {
      // Arrange
      const planByContact = allPlans.find((plan) => plan.type === PLAN_TYPE.byContact);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByContact?.id,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getDistinctPlans();

      // Assert
      expect(orderPlanTypes.map((distinctPlan) => distinctPlan.type)).toEqual([
        PLAN_TYPE.byContact,
      ]);
    });

    it('should return plan by contact when the plan is contact and annual', async () => {
      // Arrange
      const planByContact = allPlans.find((plan) => plan.type === PLAN_TYPE.byContact);
      const dopplerLegacyClient = new HardcodedDopplerLegacyClient();
      const appSessionRef = getAppSessionRef({
        idPlan: planByContact?.id,
        planType: PLAN_TYPE.byContact,
        planSubscription: 12,
      });

      // Act
      const planService = new PlanService({ dopplerLegacyClient, appSessionRef });
      const orderPlanTypes = await planService.getDistinctPlans();

      // Assert
      expect(orderPlanTypes.map((distinctPlan) => distinctPlan.type)).toEqual([
        PLAN_TYPE.byContact,
      ]);
    });
  });

  describe('getCurrentPlan method', () => {
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
      const planByContact = allPlans.find((plan) => (plan.type = PLAN_TYPE.byContact));
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
