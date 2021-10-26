import { DopplerLegacyClient } from '../doppler-legacy-client';

export interface PlanInterface {
  getPlanList(): Promise<any[]>;
}

export class PlanService implements PlanInterface {
  private PlanList: any[] = [];
  private readonly dopplerLegacyClient: DopplerLegacyClient;

  constructor({ dopplerLegacyClient }: { dopplerLegacyClient: DopplerLegacyClient }) {
    this.dopplerLegacyClient = dopplerLegacyClient;
  }

  async getPlanList(): Promise<any[]> {
    return this.PlanList.length
      ? this.PlanList
      : (this.PlanList = await this.dopplerLegacyClient.getAllPlans());
  }
}
