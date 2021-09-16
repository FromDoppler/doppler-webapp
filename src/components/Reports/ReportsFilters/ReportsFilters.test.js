import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ReportsFilters from './ReportsFilters';

describe('ReportsFilters component', () => {
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
    getByText(/reports_filters.verified_domain/i);
    getByText(/5\/30\/2018/i);
  });

  it('should show placeholder date when has not domain selected', async () => {
    // Arrange

    // Act
    const { getByText, queryByText } = render(
      <DopplerIntlProvider>
        <ReportsFilters
          changeDomain={() => {}}
          pages={[]}
          pageSelected={null}
          changePage={() => {}}
          periodSelectedDays={7}
          changePeriod={() => {}}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(queryByText(/reports_filters.no_information/i)).not.toBeInTheDocument();
    expect(getByText(/reports_filters.verified_domain/i)).toBeInTheDocument();
    expect(getByText(/--\/--\/----/i)).toBeInTheDocument();
  });

  it('should work when there is not verification date', async () => {
    // Arrange
    const domain = {
      name: 'domain.localhost',
      verified_date: null,
    };

    // Act
    const { container, getByText } = render(
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
    expect(getByText('reports_filters.no_information')).toBeInTheDocument();
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
