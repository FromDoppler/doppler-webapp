import '@testing-library/jest-dom/extend-expect';
import { getDefaultPlanType } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../doppler-types';
import { getQueryParamsWithAccountType } from '../../utils';

describe('getDefaultPlanType', () => {
  describe('Redirections when the type of plan is by email', () => {
    [
      {
        testName: `should return tag url by email when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byContact]
        }`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byContact],
      },
      {
        testName: `should return tag url by email when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        }`,
        planTypeUrlSegment: PLAN_TYPE.byCredit,
      },
    ].map((useCase) =>
      it(useCase.testName, async () => {
        // Arrange
        const currentPlan = {
          isFreeAccount: false,
          planType: PLAN_TYPE.byEmail,
          planSubscription: 1,
        };
        const window = {
          location: {
            search: '?promo-code=TEST_PROMOCODE',
          },
        };
        const { planTypeUrlSegment } = useCase;
        const queryParams = getQueryParamsWithAccountType({
          search: window.location.search,
          isFreeAccount: currentPlan.isFreeAccount,
        });
        const expectedUrl = `/buy-process/primer-pantalla/${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        }?${queryParams}`;

        // Act
        const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

        // Assert
        expect(urlToRedirect).toBe(expectedUrl);
      }),
    );

    it(`should return "null" when the path is ${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byEmail,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byEmail];

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBeNull();
    });
  });

  describe('Redirections when the type of plan is by contact', () => {
    [
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for three months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 3,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for six months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 6,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for twelve months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 12,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for three months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 3,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for six months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 6,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for twelve months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 12,
      },
    ].map((useCase) =>
      it(useCase.testName, async () => {
        // Arrange
        const currentPlan = {
          isFreeAccount: false,
          planType: PLAN_TYPE.byContact,
          planSubscription: useCase.planSubscription,
        };
        const window = {
          location: {
            search: '?promo-code=TEST_PROMOCODE',
          },
        };
        const queryParams = getQueryParamsWithAccountType({
          search: window.location.search,
          isFreeAccount: currentPlan.isFreeAccount,
        });

        const { planTypeUrlSegment } = useCase;
        const expectedUrl = `/buy-process/primer-pantalla/${
          URL_PLAN_TYPE[PLAN_TYPE.byContact]
        }?${queryParams}`;

        // Act
        const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

        // Assert
        expect(urlToRedirect).toBe(expectedUrl);
      }),
    );

    it(`should return tag url by contact when the path is ${
      URL_PLAN_TYPE[PLAN_TYPE.byCredit]
    } and subscription for one month`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const queryParams = getQueryParamsWithAccountType({
        search: window.location.search,
        isFreeAccount: currentPlan.isFreeAccount,
      });
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byCredit];
      const expectedUrl = `/buy-process/primer-pantalla/${
        URL_PLAN_TYPE[PLAN_TYPE.byContact]
      }?${queryParams}`;

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      expect(urlToRedirect).toBe(expectedUrl);
    });

    it(`should return "null" when the path is ${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byContact];

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBeNull();
    });

    it(`should return "null" when the path is ${
      URL_PLAN_TYPE[PLAN_TYPE.byEmail]
    } and subcription for one month`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const queryParams = getQueryParamsWithAccountType({
        search: window.location.search,
        isFreeAccount: currentPlan.isFreeAccount,
      });
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byEmail];
      const expectedUrl = `/buy-process/primer-pantalla/${
        URL_PLAN_TYPE[PLAN_TYPE.byContact]
      }?${queryParams}`;

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBe(expectedUrl);
    });
  });
});
