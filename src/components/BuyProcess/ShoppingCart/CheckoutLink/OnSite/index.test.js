import '@testing-library/jest-dom/extend-expect';
import { getNewCheckoutPurchaseUrl } from './index';
import { BUY_ONSITE_PLAN, PLAN_TYPE } from '../../../../../doppler-types';

describe('OnSiteCheckoutLink', () => {
  describe('getNewCheckoutPurchaseUrl function', () => {
    it('should return checkout url', async () => {
      // Arrange
      const planType = PLAN_TYPE.byContact;
      const planId = 1;
      const onSitePlanId = '1';
      const monthPlan = 1;
      const currentQueryParams = `&accountType=FREE&buyType=${BUY_ONSITE_PLAN}`;

      // Act
      const checkoutUrl = getNewCheckoutPurchaseUrl({
        planId,
        planType,
        onSitePlanId,
        monthPlan,
        currentQueryParams,
      });

      // Assert
      expect(checkoutUrl).toBe(
        `/checkout/premium/${planType}?selected-plan=${planId}&onSitePlanId=${onSitePlanId}&monthPlan=${monthPlan}${currentQueryParams}`,
      );
    });
  });
});
