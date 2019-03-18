import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import DopplerIntlProvider from '../../DopplerIntlProvider.double-with-ids-as-values';
import Reports from './Reports';

const verifiedDateAsEngString = '12/17/2017';
const verifiedDateAsDate = new Date('2017-12-17');

const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: verifiedDateAsDate,
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: verifiedDateAsDate,
  },
];

const fakePages = [{ id: 1, name: 'productos2' }, { id: 2, name: 'servicios2' }];

describe('Reports page', () => {
  afterEach(cleanup);

  it('render page without domain', () => {
    const datahubClientDouble = {
      getAccountDomains: async () => []
    };

    render(
      <DopplerIntlProvider>
        <Reports dependencies={{ datahubClient: datahubClientDouble }} />
      </DopplerIntlProvider>,
    );
  });

  it('should render domains without pages', async () => {
    const datahubClientDouble = {
      getAccountDomains: async () => fakeData,
      getPagesByDomainId: async () => [],
    };

    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports dependencies={{ datahubClient: datahubClientDouble }} />
      </DopplerIntlProvider>,
    );

    await wait(() => getByText(verifiedDateAsEngString));

    const verifiedDate = getByText(verifiedDateAsEngString);
    const domain = getByText(fakeData[1].name);

    expect(verifiedDate).toBeDefined();
    expect(domain).toBeDefined();
  });

  it('should render domains with pages', async () => {
    const datahubClientDouble = {
      getAccountDomains: async () => fakeData,
      getPagesByDomainId: async () => fakePages,
    };

    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports dependencies={{ datahubClient: datahubClientDouble }} />
      </DopplerIntlProvider>,
    );

    await wait(() => getByText(fakePages[0].name));

    const page = getByText(fakePages[0].name);

    expect(page).toBeDefined();
  });
});
