import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import DopplerIntlProvider from '../../DopplerIntlProvider.double-with-ids-as-values';

import { getDomains, getPagesByDomainId } from './ReportsService';
import Reports from './Reports';

jest.mock('./ReportsService');

const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: '17/12/2017',
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: '17/12/2020',
  },
];

const fakePages = [{ id: '1', name: 'productos2' }, { id: '2', name: 'servicios2' }];

describe('Reports page', () => {
  afterEach(cleanup);

  beforeEach(() => {
    getDomains.mockClear();
    getPagesByDomainId.mockClear();
  });

  it('render page without domain', () => {
    getDomains.mockImplementation(() => []);
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports />
      </DopplerIntlProvider>,
    );
  });

  it('should render domains without pages', async () => {
    getDomains.mockImplementation(() => fakeData);
    getPagesByDomainId.mockImplementation(() => []);
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports />
      </DopplerIntlProvider>,
    );

    await wait(() => getByText(fakeData[0].verified_date));

    const verifiedDate = getByText(fakeData[0].verified_date);
    const domain = getByText(fakeData[1].name);

    expect(verifiedDate).toBeDefined();
    expect(domain).toBeDefined();
  });

  it('should render domains with pages', async () => {
    getDomains.mockImplementation(() => fakeData);
    getPagesByDomainId.mockImplementation(() => fakePages);
    const { getByText } = render(
      <DopplerIntlProvider>
        <Reports />
      </DopplerIntlProvider>,
    );

    await wait(() => getByText(fakePages[0].name));

    const page = getByText(fakePages[0].name);

    expect(page).toBeDefined();
  });
});
