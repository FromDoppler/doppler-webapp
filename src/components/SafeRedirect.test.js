import React from 'react';
import { render, cleanup } from '@testing-library/react';
import SafeRedirect from './SafeRedirect';
import { AppServicesProvider } from '../services/pure-di';

describe('SafeRedirect component', () => {
  afterEach(cleanup);

  it('redirects to doppler in partial url', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };
    const toUrl = '/dashboard';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).toBe(
      dependencies.appConfiguration.dopplerLegacyUrl + toUrl,
    );
  });

  it('redirects to doppler in partial url with parameters', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };
    const toUrl = '/Campaigns/Draft?idCampaign=3&orderby=name';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).toBe(
      dependencies.appConfiguration.dopplerLegacyUrl + toUrl,
    );
  });

  it('redirects to full url only when whitelisted', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };

    const toUrl = 'https://academy.fromdoppler.com/';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).toBe(toUrl);
  });

  it('redirects to full url http only when whitelisted', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };

    const toUrl = 'http://prod.doppleracademy.com/';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).toBe(toUrl);
  });

  it('redirects to full with longer route and parameters url only when whitelisted', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };
    const toUrl = 'https://academy.fromdoppler.com/section1/section2?param1=value1&param2=value2';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).toBe(toUrl);
  });

  it('does not redirects to full url not whitelisted', () => {
    //Arrange
    const dependencies = {
      window: { location: { href: '/dashboard/' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
    };
    const toUrl = 'https://notregistered.com/';

    //Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <SafeRedirect to={toUrl}></SafeRedirect>
      </AppServicesProvider>,
    );

    //Assert
    expect(dependencies.window.location.href).not.toBe(toUrl);
  });
});
