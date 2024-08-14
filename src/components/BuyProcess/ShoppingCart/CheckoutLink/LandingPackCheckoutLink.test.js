import '@testing-library/jest-dom/extend-expect';
import { BUY_LANDING_PACK, PLAN_TYPE } from '../../../../doppler-types';
import { getNewCheckoutPurchaseUrl } from './LandingPackCheckoutLink';

describe('LandingPackCheckoutLink', () => {
  describe('getNewCheckoutPurchaseUrl function', () => {
    it('should return checkout url', async () => {
      // Arrange
      const planType = PLAN_TYPE.byContact;
      const landingIds = '1,2,3';
      const landingPacks = '5,2,1';
      const monthPlan = 1;
      const currentQueryParams = `&accountType=FREE&buyType=${BUY_LANDING_PACK}`;

      // Act
      const checkoutUrl = getNewCheckoutPurchaseUrl({
        planType,
        landingIds,
        landingPacks,
        monthPlan,
        currentQueryParams,
      });

      // Assert
      expect(checkoutUrl).toBe(
        `/checkout/premium/${planType}?landing-ids=${landingIds}&landing-packs=${landingPacks}&monthPlan=${monthPlan}${currentQueryParams}`,
      );
    });
  });
});
