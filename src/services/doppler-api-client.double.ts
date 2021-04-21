import {
  DopplerApiClient,
  Subscriber,
  CampaignDeliveryCollection,
  SubscriberCollection,
  CampaignSummaryResults,
  CampaignInfo,
  Fields,
  FieldHistoryPage,
} from './doppler-api-client';
import { SubscriberList } from './shopify-client';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

const listExist = {
  success: true,
  value: {
    name: 'Shopify Contacto',
    id: 27311899,
    amountSubscribers: 3,
    state: 1,
  },
};

// To test when list doesn't exist
// const listNotExists = { success: false, error: 'Error' };

const subscriber = {
  email: 'test@fromdoppler.com',
  fields: [
    {
      name: 'FIRSTNAME',
      value: 'Manuel',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
    {
      name: 'LASTNAME',
      value: 'di Rago',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
    {
      name: 'BIRTHDAY',
      value: '1983-09-28',
      predefined: true,
      private: false,
      readonly: false,
      type: 'date',
    },
    {
      name: 'CONSENT',
      value: 'False',
      predefined: true,
      private: false,
      readonly: false,
      type: 'consent',
    },
    {
      name: 'Permiso2',
      value: 'true',
      predefined: false,
      private: false,
      readonly: false,
      type: 'permission',
      permissionHTML:
        '<p>Acepta las promociones indicadas <a href="http://www.google.com">aqui</a></p>',
    },
    {
      name: 'ddddSssss',
      value: 'true',
      predefined: false,
      private: true,
      readonly: false,
      type: 'permission',
    },
    {
      name: 'AceptaPromociones',
      value: 'true',
      predefined: false,
      private: false,
      readonly: false,
      type: 'permission',
      permissionHTML:
        '<p>Haciendo click en el checkbox confirma y acepta nuestras <a href="google.com">bases y condiciones.</a></p>',
    },
  ],
  unsubscribedDate: '2019-11-27T18:05:40.847Z',
  unsubscriptionType: 'hardBounce',
  manualUnsubscriptionReason: 'administrative',
  unsubscriptionComment: 'test',
  status: 'unsubscribed_by_hard',
  score: 2,
};

// const subscriberWithNoGDPR = {
//   email: 'test@fromdoppler.com',
//   fields: [
//     {
//       name: 'FIRSTNAME',
//       value: 'Manuel',
//       predefined: true,
//       private: false,
//       readonly: true,
//       type: 'string',
//     },
//   ],
//   unsubscribedDate: '2019-11-27T18:05:40.847Z',
//   unsubscriptionType: 'hardBounce',
//   manualUnsubscriptionReason: 'administrative',
//   unsubscriptionComment: 'test',
//   status: 'unsubscribed_by_hard',
//   score: 2,
// };

const getDeliveryStatus = (statusNumber: number) => {
  switch (statusNumber) {
    case 1:
      return 'opened';
    case 2:
      return 'softBounced';
    case 3:
      return 'hardBounced';
    default:
      return 'notOpened';
  }
};

const campaignDeliveryItems = [...Array(100)].map((_, index) => {
  return {
    campaignId: index,
    campaignName: 'Campaña estacional de primavera',
    campaignSubject: '¿Como sacarle provecho a la primavera?',
    deliveryStatus: getDeliveryStatus(Math.round(Math.random() * (5 - 1) + 1)),
    clicksCount: Math.round(Math.random() * (100 - 1) + 1),
    isSendingNow: index % 2 === 0,
    urlImgPreview:
      'http://dopplerfilesint.fromdoppler.net/Users/50018/Campaigns/33850437/33850437.png',
  };
});

const subscriberCollection = {
  items: [
    {
      email: 'test@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Manuel',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'di Rago',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '2019-11-27T18:05:40.847Z',
      unsubscriptionType: 'hardBounce',
      manualUnsubscriptionReason: 'administrative',
      unsubscriptionComment: 'test',
      status: 'active',
      score: 0,
    },
    {
      email: 'pepe@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Pepe',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'Gonzales',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '',
      unsubscriptionType: '',
      manualUnsubscriptionReason: '',
      unsubscriptionComment: '',
      status: 'inactive',
      score: 1,
    },
  ],
  currentPage: 0,
  itemsCount: 2,
  pagesCount: 1,
};

const campaignSummaryResults = {
  totalRecipients: 500000,
  successFullDeliveries: 20000,
  timesForwarded: 1000,
  totalTimesOpened: 10000,
  lastOpenDate: null,
  uniqueClicks: 300,
  uniqueOpens: 500,
  totalUnopened: 10000,
  totalHardBounces: 2000,
  totalSoftBounces: 3000,
  totalClicks: 2000,
  lastClickDate: '2019-11-27T18:05:40.847Z',
  totalUnsubscribers: 500,
  campaignStatus: 'shipping',
  totalShipped: 50000,
};

export class HardcodedDopplerApiClient implements DopplerApiClient {
  public async getListData(
    idList: number,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    console.log('getApiListData');
    await timeout(1500);
    return listExist;
    // return listNotExists;
  }

  public async getSubscriber(
    email: string,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<Subscriber>> {
    console.log('getApiSubscriber');
    await timeout(1500);

    return {
      success: true,
      value: { ...subscriber, email: email },
    };

    // return {
    //   success: true,
    //   value: { ...subscriberWithNoGDPR, email: email, },
    // };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getSubscriberSentCampaigns(
    email: string,
    campaignsPerPage: number,
    currentPage: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignDeliveryCollection>> {
    console.log('getSubscriberSentCampaigns', email, campaignsPerPage, currentPage);
    await timeout(1500);

    let pagesSubArray = [];

    if (campaignsPerPage) {
      const indexStart = campaignsPerPage * (currentPage - 1);
      const indexEnd = indexStart + campaignsPerPage;
      pagesSubArray = campaignDeliveryItems.slice(indexStart, indexEnd);
    } else {
      pagesSubArray = campaignDeliveryItems;
    }

    const campaignDeliveryCollection = {
      items: pagesSubArray,
      currentPage: currentPage,
      itemsCount: campaignDeliveryItems.length,
      pagesCount: Math.floor(campaignDeliveryItems.length / campaignsPerPage),
    };

    return {
      success: true,
      value: campaignDeliveryCollection,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getSubscribers(
    searchText: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberCollection>> {
    console.log('getSubscribers');
    await timeout(1500);

    return {
      success: true,
      value: subscriberCollection,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getCampaignSummaryResults(
    campaignId: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignSummaryResults>> {
    console.log('getCampaignsSummaryResult');
    await timeout(1500);

    return {
      success: true,
      value: campaignSummaryResults,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getCampaignNameAndSubject(
    campaignId: number,
  ): Promise<ResultWithoutExpectedErrors<CampaignInfo>> {
    console.log('getCampaignNameAndSubject');
    await timeout(1500);

    return {
      success: true,
      value: { name: 'Campaign test', subject: 'Subject test' },
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getUserFields(): Promise<ResultWithoutExpectedErrors<Fields[]>> {
    console.log('getCampaignNameAndSubject');
    await timeout(1500);
    // const fieldsNoPermission = [
    //   {
    //     name: 'FIRSTNAME',
    //     value: 'Pepe',
    //     predefined: true,
    //     private: false,
    //     readonly: true,
    //     type: 'string',
    //   },
    //   {
    //     name: 'LASTNAME',
    //     value: 'Gonzales',
    //     predefined: true,
    //     private: false,
    //     readonly: true,
    //     type: 'string',
    //   },
    // ];

    const fieldsPermission = [
      {
        name: 'FIRSTNAME',
        value: 'Pepe',
        predefined: true,
        private: false,
        readonly: true,
        type: 'string',
      },
      {
        name: 'LASTNAME',
        value: 'Gonzales',
        predefined: true,
        private: false,
        readonly: true,
        type: 'string',
      },
      {
        name: 'BIRTHDAY',
        value: '1983-09-28',
        predefined: true,
        private: false,
        readonly: false,
        type: 'date',
      },
      {
        name: 'CONSENT',
        value: 'False',
        predefined: true,
        private: false,
        readonly: false,
        type: 'consent',
      },
      {
        name: 'Permiso2',
        value: 'true',
        predefined: false,
        private: false,
        readonly: false,
        type: 'permission',
        permissionHTML:
          '<p>Acepta las promociones indicadas <a href="http://www.google.com">aqui</a></p>',
      },
      {
        name: 'lalo',
        value: 'true',
        predefined: false,
        private: false,
        readonly: false,
        type: 'permission',
      },
      {
        name: 'ddddSssss',
        value: 'true',
        predefined: false,
        private: true,
        readonly: false,
        type: 'permission',
      },
      {
        name: 'AceptaPromociones',
        value: 'true',
        predefined: false,
        private: false,
        readonly: false,
        type: 'permission',
        permissionHTML:
          '<p>Haciendo click en el checkbox confirma y acepta nuestras <a href="google.com">bases y condiciones.</a></p>',
      },
    ];
    return {
      success: true,
      value: fieldsPermission,
    };
  }

  public async getSubscriberPermissionHistory({
    subscriberEmail,
    fieldName,
  }: {
    subscriberEmail: string;
    fieldName: string;
  }): Promise<ResultWithoutExpectedErrors<FieldHistoryPage>> {
    console.log('getSubscriberPermissionHistory', subscriberEmail, fieldName);
    await timeout(1500);
    return {
      success: true,
      value: {
        items: [
          {
            subscriberEmail: subscriberEmail,
            fieldName: fieldName,
            fieldType: 'permission',
            date: new Date('2021-02-10T15:22:00.000Z'),
            value: 'true',
            originIP: '181.167.226.47',
            originType: 'Formulario',
          },
          {
            subscriberEmail: subscriberEmail,
            fieldName: fieldName,
            fieldType: 'permission',
            date: new Date('2021-02-05T10:11:24.000Z'),
            value: 'none',
            originIP: '181.167.226.30',
            originType: 'Formulario',
          },
          {
            subscriberEmail: subscriberEmail,
            fieldName: fieldName,
            fieldType: 'permission',
            date: new Date('2021-01-05T01:05:04.123Z'),
            value: 'false',
            originIP: '181.167.226.20',
            originType: 'Manual',
          },
        ],
        currentPage: 1,
        itemsCount: 3,
        pagesCount: 1,
      },
    };
  }
}
