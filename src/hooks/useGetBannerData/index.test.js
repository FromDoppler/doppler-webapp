import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useGetBannerData } from '.';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';

const createWrapper = (Wrapper) => {
  return function CreatedWrapper({ children }) {
    return <Wrapper>{children}</Wrapper>;
  };
};

const Wrapper = ({ children }) => (
  <IntlProvider>
    <Router>{children}</Router>
  </IntlProvider>
);

describe('useGetBannerData', () => {
  it('should complete getBannerData with success', async () => {
    // Arrange
    const bannerData = {
      title: 'fake title',
      description: 'fake description',
      backgroundUrl: 'fake background',
      imageUrl: 'fake image',
      functionality: 'fake functionality',
      fontColor: '#000',
    };
    const dopplerSitesClientFake = {
      getBannerData: jest.fn().mockResolvedValue({ success: true, value: bannerData }),
    };
    const props = {
      dopplerSitesClient: dopplerSitesClientFake,
      type: 'signup',
      page: 'dts',
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useGetBannerData(props), {
      wrapper: createWrapper(Wrapper),
    });

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.bannerData).toBe(bannerData);
  });

  it('should complete getBannerData with banner data by default', async () => {
    // Arrange
    const dopplerSitesClientFake = {
      getBannerData: jest.fn().mockResolvedValue({ success: false, value: null }),
    };
    const props = {
      dopplerSitesClient: dopplerSitesClientFake,
      type: 'signup',
      page: 'dts',
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useGetBannerData(props), {
      wrapper: createWrapper(Wrapper),
    });

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.bannerData).toEqual({
      title: 'default_banner_data.title',
      description: 'default_banner_data.description',
      backgroundUrl: 'default_banner_data.background_url',
      imageUrl: 'default_banner_data.image_url',
      functionality: 'default_banner_data.functionality',
      fontColor: '#FFF',
    });
  });
});
