import { ResultWithoutExpectedErrors } from '../doppler-types';
import { addDays } from '../utils';
import { ContactSummary, ReportClient } from './reports/index';

export interface ContactKpi {
  id: Number;
  kpiTitleId: String;
  kpiValue: Number | String;
  iconClass: String;
  kpiPeriodId?: String;
}

export interface ContactSummaryInterface {
  getContactsSummary(): Promise<any>;
}

export class ContactSummaryService implements ContactSummaryInterface {
  private readonly reportClient: ReportClient;

  constructor({ reportClient }: { reportClient: ReportClient }) {
    this.reportClient = reportClient;
  }

  async getContactsSummary(): Promise<ResultWithoutExpectedErrors<ContactKpi[]>> {
    const dateTo = new Date();
    const dateFrom = addDays(dateTo, -30);
    const response = await this.reportClient.getContactsSummary({
      dateFrom,
      dateTo,
    });

    return response.success
      ? {
          ...response,
          value: mapContactSummary(response.value),
        }
      : response;
  }
}

export const mapContactSummary = (contactSummary: ContactSummary): ContactKpi[] => [
  {
    id: 1,
    kpiTitleId: 'dashboard.contacts.totalContacts',
    kpiValue: contactSummary.totalSubscribers,
    iconClass: 'book',
    kpiPeriodId: 'dashboard.total',
  },
  {
    id: 2,
    kpiTitleId: 'dashboard.contacts.totalNewContacts',
    kpiValue: contactSummary.newSubscribers,
    iconClass: 'user-new',
  },
  {
    id: 3,
    kpiTitleId: 'dashboard.contacts.totalRemovedContacts',
    kpiValue: contactSummary.removedSubscribers,
    iconClass: 'user-removed',
  },
];
