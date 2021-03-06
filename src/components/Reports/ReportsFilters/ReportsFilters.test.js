import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ReportsFilters from './ReportsFilters';

describe('ReportsFilters component', () => {
  afterEach(cleanup);

  it('should show verification date', async () => {
    // Arrange
    const domain = {
      name: 'domain.localhost',
      verified_date: new Date('2018-05-30T15:30:10Z'),
    };

    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <ReportsFilters
          changeDomain={() => {}}
          domains={[domain]}
          domainSelected={domain}
          pages={[]}
          pageSelected={null}
          changePage={() => {}}
          periodSelectedDays={7}
          changePeriod={() => {}}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    getByText('reports_filters.verified_domain');
    getByText('5/30/2018');
  });

  it('should work when there is not verification date', async () => {
    // Arrange
    const domain = {
      name: 'domain.localhost',
      verified_date: null,
    };

    // Act
    const { container } = render(
      <DopplerIntlProvider>
        <ReportsFilters
          changeDomain={() => {}}
          domains={[domain]}
          domainSelected={domain}
          pages={[]}
          pageSelected={null}
          changePage={() => {}}
          periodSelectedDays={7}
          changePeriod={() => {}}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container).not.toContainHTML('reports_filters.verified_domain');
  });

  it('should show 2 and 3 weeks when isEnableWeeks true', async () => {
    // Arrange
    const domain = {
      name: 'domain.localhost',
      verified_date: new Date('2018-05-30T15:30:10Z'),
    };

    // Act
    const { getAllByText } = render(
      <DopplerIntlProvider>
        <ReportsFilters
          isEnableWeeks
          changeDomain={() => {}}
          domains={[domain]}
          domainSelected={domain}
          pages={[]}
          pageSelected={null}
          changePage={() => {}}
          periodSelectedDays={7}
          changePeriod={() => {}}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(getAllByText('reports_filters.week_with_plural'));
  });

  it('should show 1 week when isEnableWeeks false', async () => {
    // Arrange
    const domain = {
      name: 'domain.localhost',
      verified_date: new Date('2018-05-30T15:30:10Z'),
    };

    // Act
    const { getByText } = render(
      <DopplerIntlProvider>
        <ReportsFilters
          changeDomain={() => {}}
          domains={[domain]}
          domainSelected={domain}
          pages={[]}
          pageSelected={null}
          changePage={() => {}}
          periodSelectedDays={7}
          changePeriod={() => {}}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(getByText('reports_filters.week_with_plural'));
  });
});
