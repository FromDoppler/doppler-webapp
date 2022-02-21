import {
  DopplerUserApiClient,
  ContactInformation,
  Features,
  IntegrationsStatus,
} from './doppler-user-api-client';
import { EmptyResultWithoutExpectedErrors, ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

export const fakeContactInformation = {
  email: 'test@makingsense.com',
  firstname: 'Test',
  lastname: 'Test',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'AR-B',
  country: 'ar',
  zipCode: '7000',
  phone: '+54 249 422-2222',
  company: 'Making Sense',
  industry: 'dplr1',
  idSecurityQuestion: '1',
  answerSecurityQuestion: 'answer',
};

const featuresResult = {
  contactPolicies: true,
  bigQuery: true,
};

const integrationsStatusResult: IntegrationsStatus = {
  apiKeyStatus: 'connected',
  dkimStatus: 'alert',
  customDomainStatus: 'disconnected',
  tiendanubeStatus: 'connected',
  TokkoBrokerStatus: 'disconnected',
  datahubStatus: 'disconnected',
  prestashopStatus: 'disconnected',
  shopifyStatus: 'disconnected',
  magentoStatus: 'alert',
  zohoStatus: 'connected',
  wooCommerceStatus: 'disconnected',
  easycommerceStatus: 'connected',
  bmwRspCrmStatus: 'alert',
  vtexStatus: 'alert',
  googleAnaliyticStatus: 'connected',
  bigQueryStatus: 'disconnected',
  MercadoLibreStatus: 'connected',
  MercadoShopsStatus: 'disconnected',
  MiTiendaStatus: 'connected',
};

export class HardcodedDopplerUserApiClient implements DopplerUserApiClient {
  public async getContactInformationData(): Promise<
    ResultWithoutExpectedErrors<ContactInformation>
  > {
    console.log('getContactInformationData');
    await timeout(1500);

    return {
      value: fakeContactInformation,
      success: true,
    };
  }

  public async updateContactInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    await timeout(1500);
    console.log(values);
    return {
      success: true,
    };
  }

  async getFeatures(): Promise<ResultWithoutExpectedErrors<Features>> {
    console.log('getFeatures');
    await timeout(1500);

    return {
      value: featuresResult,
      success: true,
    };
  }

  async getIntegrationsStatus(): Promise<ResultWithoutExpectedErrors<IntegrationsStatus>> {
    console.log('getIntegrationsStatus');
    await timeout(1500);

    return {
      value: integrationsStatusResult,
      success: true,
    };
  }
}
