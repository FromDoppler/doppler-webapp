import { HttpBaseClient } from './http-base-client';
import { ResultWithoutExpectedErrors } from '../doppler-types';

export interface SystemUsage {
  email: string;
  reportsSectionLastVisit: string | undefined;
}

export interface DopplerSystemUsageApiClient {
  getUserSystemUsage(): Promise<ResultWithoutExpectedErrors<SystemUsage>>;
}

export class HttpDopplerSystemUsageApiClient
  extends HttpBaseClient
  implements DopplerSystemUsageApiClient
{
  private clientName = 'System Usage';

  public async getUserSystemUsage(): Promise<ResultWithoutExpectedErrors<SystemUsage>> {
    try {
      const { email, jwtToken } = this.getApiConnectionData(this.clientName);

      const response = await this.axios.request({
        method: 'GET',
        url: `/${email}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return {
          success: true,
          value: {
            email: response.data.email,
            reportsSectionLastVisit: response.data.reportsSectionLastVisit,
          },
        };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return { success: false, error };
    }
  }
}
