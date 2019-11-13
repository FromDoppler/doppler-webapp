import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Promotions from './Promotions';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';

const emptyResponse = { success: false, error: new Error('Dummy error') };
const fullResponse = {
  success: true,
  value: {
    title: 'default_banner_data.title',
    description: 'default_banner_data.description',
    backgroundUrl: 'default_banner_data.background_url',
    imageUrl: 'default_banner_data.image_url',
    functionality: 'default_banner_data.functionality',
    color: '#fff',
  },
};

describe('Promotions Component', () => {
  afterEach(cleanup);
  it('should sites response fail', async () => {
    const dopplerSitesClientDouble = {
      getBannerData: async () => emptyResponse,
    };

    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerSitesClient: dopplerSitesClientDouble,
        }}
      >
        <DopplerIntlProvider locale="es">
          <Promotions type="signup" page="example" />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText('default_banner_data.title'));
  });

  it('should has full data from service', async () => {
    const dopplerSitesClientDouble = {
      getBannerData: async () => fullResponse,
    };

    const { container, getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerSitesClient: dopplerSitesClientDouble,
        }}
      >
        <DopplerIntlProvider locale="es">
          <Promotions type="signup" page="example" />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
    await waitForDomChange();
    expect(getByText(fullResponse.value.title));
  });
});
