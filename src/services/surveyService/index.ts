import { HttpBaseClient } from './../http-base-client';
import { ResultWithoutExpectedErrors, EmptyResultWithoutExpectedErrors } from '../../doppler-types';

export interface SurveyFormStatus {
  surveyFormCompleted: Boolean;
}

export interface SurveyClient {
  getSurveyFormStatus(): Promise<ResultWithoutExpectedErrors<SurveyFormStatus>>;
  setSurveyToCompleted(): Promise<EmptyResultWithoutExpectedErrors>;
}

export class HttpSurveyClient extends HttpBaseClient implements SurveyClient {
  private clientName = 'Survey';

  public async getSurveyFormStatus(): Promise<ResultWithoutExpectedErrors<SurveyFormStatus>> {
    try {
      const { jwtToken } = this.getApiConnectionData(this.clientName);
      const response = await this.axios.request({
        method: 'GET',
        url: `/Integration/Integration/GetSurveyFormStatus`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      return {
        success: true,
        value: response.data,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }

  public async setSurveyToCompleted(): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { jwtToken } = this.getApiConnectionData(this.clientName);
      await this.axios.request({
        method: 'PUT',
        url: `/Integration/Integration/SetCompletedForm`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }
}
