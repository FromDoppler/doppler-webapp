import { StaticDataClient } from './static-data-client';
import { timeout } from '../utils';

export const fakeIndustries = {
  dplr1: 'Alimentación / Consumo Masivo',
  dplr2: 'Automóviles',
  dplr3: 'Banca / Finanzas / Seguros',
  dplr4: 'Belleza / Cosmética',
  dplr5: 'Otros',
};

export class HardcodedStaticDataClient implements StaticDataClient {
  public async getIndustriesData(language: string): Promise<any> {
    await timeout(1500);
    return {
      value: fakeIndustries,
      success: true,
    };
  }
}
