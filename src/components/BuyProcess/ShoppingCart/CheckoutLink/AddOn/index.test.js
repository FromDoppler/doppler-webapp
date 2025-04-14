import '@testing-library/jest-dom/extend-expect';
import { getNewCheckoutPurchaseUrl } from './index';
import { BUY_ONSITE_PLAN, PLAN_TYPE } from '../../../../../doppler-types';

describe('AddOnCheckoutLink', () => {
  describe('getNewCheckoutPurchaseUrl function', () => {
    it('should return checkout url', async () => {
      // Arrange
      const planType = PLAN_TYPE.byContact;
      const planId = 1;
      const addOnPlanId = '1';
      const monthPlan = 1;
      const currentQueryParams = `&accountType=FREE&buyType=${BUY_ONSITE_PLAN}`;

      // Act
      const checkoutUrl = getNewCheckoutPurchaseUrl({
        planId,
        planType,
        addOnPlanId,
        monthPlan,
        currentQueryParams,
      });

      // Assert
      expect(checkoutUrl).toBe(
        `/checkout/premium/${planType}?selected-plan=${planId}&addOnPlanId=${addOnPlanId}&monthPlan=${monthPlan}${currentQueryParams}`,
      );
    });
  });
});
