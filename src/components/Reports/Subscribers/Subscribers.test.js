import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { Route, Routes } from 'react-router-dom';
import Subscribers from './Subscribers';
import { MemoryRouter } from 'react-router';

describe('Subscribers component', () => {
  afterEach(cleanup);

  const subscriber = {
    email: 'test@test.com',
    fields: [
      {
        name: 'FIRSTNAME',
        value: 'Manuel',
        predefined: true,
        private: true,
        readonly: true,
        type: 'boolean',
      },
    ],
    unsubscribedDate: '2019-11-27T18:05:40.847Z',
    unsubscriptionType: 'hardBounce',
    manualUnsubscriptionReason: 'administrative',
    unsubscriptionComment: 'test',
    status: 'active',
    score: 0,
  };

  const campaignDeliveryCollection = {
    items: [
      {
        campaignId: 1,
        campaignName: 'Campaña estacional de primavera',
        campaignSubject: '¿Como sacarle provecho a la primavera?',
        deliveryStatus: 'opened',
        clicksCount: 2,
        urlImgPreview: '',
      },
    ],
    currentPage: 0,
    itemsCount: 1,
    pagesCount: 1,
  };

  const fields = [
    {
      name: 'FIRSTNAME',
      value: 'Manuel',
      predefined: true,
      private: true,
      readonly: true,
      type: 'boolean',
    },
    {
      name: 'Accept_promotions',
      value: '<p>Acepta promociones </p>',
      predefined: true,
      private: true,
      readonly: true,
      type: 'permission',
    },
  ];

  const SubscribersElement = ({ dependencies, route }) => (
    <AppServicesProvider forcedServices={dependencies}>
      <IntlProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/subscribers/:email/:section" element={<Subscribers />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
  );

  it('redirect to master subscriber when subscriber does not exist', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: false };
      },
    };
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
      dopplerApiClient: dopplerApiClientDouble,
    };
    const toUrl = '/Lists/MasterSubscriber/';

    // Act
    render(
      <SubscribersElement
        dependencies={dependencies}
        route="/subscribers/mailt@mail.com/history"
      />,
    );
    // Assert
    await waitFor(() =>
      expect(dependencies.window.location.href).toBe(
        dependencies.appConfiguration.dopplerLegacyUrl + toUrl,
      ),
    );
  });

  it('redirect to master subscriber when section does not exist', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
    };
    const dependencies = {
      window: { location: { href: '' } },
      appConfiguration: {
        dopplerLegacyUrl: 'http://localhost:52191',
      },
      dopplerApiClient: dopplerApiClientDouble,
    };
    const toUrl = '/Lists/MasterSubscriber/';

    // Act
    render(
      <SubscribersElement
        dependencies={dependencies}
        route="/subscribers/mailt@mail.com/undefined"
      />,
    );
    // Assert
    await waitFor(() =>
      expect(dependencies.window.location.href).toBe(
        dependencies.appConfiguration.dopplerLegacyUrl + toUrl,
      ),
    );
  });

  it('should show subscriber firstName', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
      getUserFields: async () => {
        return { success: true, value: fields };
      },
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    const dependencies = {
      dopplerApiClient: dopplerApiClientDouble,
    };

    // Act
    const { getByText } = render(
      <SubscribersElement
        dependencies={dependencies}
        route="/subscribers/mailt@mail.com/history"
      />,
    );
    // Assert
    await waitFor(() => expect(getByText('Manuel')).toBeInTheDocument());
  });

  it('should show stand by status', async () => {
    // Arrange
    const subscriberStandBy = subscriber;
    subscriberStandBy.status = 'standBy';
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriberStandBy };
      },
      getUserFields: async () => {
        return { success: true, value: fields };
      },
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    const dependencies = {
      dopplerApiClient: dopplerApiClientDouble,
    };

    // Act
    const { getByText } = render(
      <SubscribersElement
        dependencies={dependencies}
        route="/subscribers/mailt@mail.com/history"
      />,
    );
    // Assert
    await waitFor(() => expect(getByText('subscriber.status.standBy')).toBeInTheDocument());
  });

  it('renders subscriber gdpr intenationalized title', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
      getUserFields: async () => {
        return { success: true, value: fields };
      },
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    const dependencies = {
      dopplerApiClient: dopplerApiClientDouble,
    };

    // Act
    const { getAllByText } = render(
      <SubscribersElement dependencies={dependencies} route="/subscribers/mailt@mail.com/gdpr" />,
    );
    // Assert
    await waitFor(() => expect(getAllByText('subscriber_gdpr.title')[0]).toBeInTheDocument());
  });

  it('component should have a page title defined', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
      getUserFields: async () => {
        return { success: true, value: fields };
      },
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    const dependencies = {
      dopplerApiClient: dopplerApiClientDouble,
    };

    // Act
    render(
      <SubscribersElement dependencies={dependencies} route="/subscribers/mailt@mail.com/gdpr" />,
    );

    //Assert
    await waitFor(() => expect(document.title).toEqual('subscriber_gdpr.title'));
  });

  it('should show subscriber email', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
      getUserFields: async () => {
        return { success: true, value: fields };
      },
      getSubscriberSentCampaigns: async () => {
        return { success: true, value: campaignDeliveryCollection };
      },
    };

    const dependencies = {
      dopplerApiClient: dopplerApiClientDouble,
    };

    // Act
    const { getByText } = render(
      <SubscribersElement
        dependencies={dependencies}
        route="/subscribers/mailt@mail.com/history"
      />,
    );

    // Assert
    await waitFor(() => expect(getByText(subscriber.email)).toBeInTheDocument());
  });
});
