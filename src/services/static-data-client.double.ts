import { StaticDataClient } from './static-data-client';
import { timeout } from '../utils';

export const fakeIndustries = {
  dplr1: 'Alimentación / Consumo Masivo',
  dplr2: 'Automóviles',
  dplr3: 'Banca / Finanzas / Seguros',
  dplr4: 'Belleza / Cosmética',
  dplr5: 'Otros',
};

export const fakeQuestions = [
  { key: '1', value: 'Question 1' },
  { key: '2', value: 'Question 2' },
  { key: '3', value: 'Question 3' },
];

export const fakeStates = [
  { key: 'AR-B', value: 'Buenos Aires' },
  { key: 'AR-C', value: 'Capital federal' },
  { key: 'AR-K', value: 'Catamarca' },
  { key: 'AR-H', value: 'Chaco' },
  { key: 'AR-U', value: 'Chubut' },
  { key: 'AR-X', value: 'Córdoba' },
  { key: 'AR-W', value: 'Corrientes' },
  { key: 'AR-E', value: 'Entre Ríos' },
  { key: 'AR-P', value: 'Formosa' },
  { key: 'AR-Y', value: 'Jujuy' },
  { key: 'AR-L', value: 'La Pampa' },
  { key: 'AR-F', value: 'La Rioja' },
  { key: 'AR-M', value: 'Mendoza' },
  { key: 'AR-N', value: 'Misiones' },
  { key: 'AR-Q', value: 'Neuquén' },
  { key: 'AR-R', value: 'Río Negro' },
  { key: 'AR-A', value: 'Salta' },
  { key: 'AR-J', value: 'San Juan' },
  { key: 'AR-D', value: 'San Luis' },
  { key: 'AR-Z', value: 'Santa Cruz' },
  { key: 'AR-S', value: 'Santa Fe' },
  { key: 'AR-G', value: 'Santiago del Estero' },
  { key: 'AR-V', value: 'Tierra del Fuego' },
  { key: 'AR-T', value: 'Tucumán' },
];

export class HardcodedStaticDataClient implements StaticDataClient {
  public async getIndustriesData(language: string): Promise<any> {
    await timeout(1500);
    return {
      value: fakeIndustries,
      success: true,
    };
  }

  public async getStatesData(country: string, language: string): Promise<any> {
    await timeout(1500);
    return {
      value: fakeStates,
      success: true,
    };
  }

  public async getSecurityQuestionsData(language: string): Promise<any> {
    await timeout(1500);
    return {
      value: fakeQuestions,
      success: true,
    };
  }
}
