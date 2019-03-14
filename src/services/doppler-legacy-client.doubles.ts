import {
  DopplerLegacyClient,
  mapHeaderDataJson,
  DopplerLegacyUpgradePlanContactModel,
} from './doppler-legacy-client';
import headerDataJson from '../headerData.json';
import { timeout } from '../utils';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public constructor(public readonly email = 'hardcoded@email.com') {}

  public async getUserData() {
    await timeout(3000);
    const { user, nav, alert } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: this.email,
      },
      nav: nav,
      alert,
    };
  }

  public async getUpgradePlanData(isSubscriberPlan: boolean) {
    await timeout(3000);
    return {
      ClientTypePlans: [
        {
          IdUserTypePlan: 1,
          Description: 'Plan 1 Descripción',
          EmailQty: 12345,
          Fee: 678.9,
          ExtraEmailCost: 0.0123,
          SubscribersQty: 456,
        },
        {
          IdUserTypePlan: 2,
          Description: 'Plan 2 Descripción',
          EmailQty: null,
          Fee: 678.9,
          ExtraEmailCost: null,
          SubscribersQty: 456,
        },
        {
          IdUserTypePlan: 3,
          Description: 'Plan 3 Descripción',
          EmailQty: 12345,
          Fee: 678.9,
          ExtraEmailCost: 0.0123,
          SubscribersQty: null,
        },
      ],
    };
  }

  public async sendEmailUpgradePlan(planModel: DopplerLegacyUpgradePlanContactModel) {
    await timeout(3000);
  }
}
