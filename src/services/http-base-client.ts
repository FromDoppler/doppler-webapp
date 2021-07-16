import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

interface ApiConnectionData {
  jwtToken: string;
  email: string;
}

export class HttpBaseClient {
  readonly axios: AxiosInstance;
  readonly baseUrl: string;
  readonly connectionDataRef: RefObject<AppSession>;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
  }

  getApiConnectionData(clientName: String): ApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error(`The ${clientName} API connection is not available`);
    }
    return {
      jwtToken: connectionData.jwtToken,
      email: connectionData.userData.user ? connectionData.userData.user.email : '',
    };
  }
}
