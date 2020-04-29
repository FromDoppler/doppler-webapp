import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ReportsBox from './ReportsBox';
import { addDays } from '../../../utils';

describe('ReportsBox component', () => {
  afterEach(cleanup);

  it('should show loading when flag is set to loading and visits are null or undefined', () => {
    // Arrange
    const today = new Date();
    const dateFrom = addDays(today, -1);
    const dateTo = today;
    const visits = null;
    const loading = true;

    // Act
    const { container } = render(
      <DopplerIntlProvider>
        <ReportsBox
          dateFrom={dateFrom}
          dateTo={dateTo}
          emailFilter={'with_email'}
          today={today}
          visits={visits}
          loading={loading}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).toBeInTheDocument();
  });

  it('should show visits 0 and warning when dont have visits', () => {
    // Arrange
    const today = new Date();
    const dateFrom = addDays(today, -1);
    const dateTo = today;
    const visits = 0;
    const loading = false;

    // Act
    const { container } = render(
      <DopplerIntlProvider>
        <ReportsBox
          dateFrom={dateFrom}
          dateTo={dateTo}
          emailFilter={'with_email'}
          today={today}
          visits={visits}
          loading={loading}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).not.toBeInTheDocument();
    expect(container.querySelector('.warning--kpi')).toBeInTheDocument();
    expect(container.querySelector('.number-kpi').innerHTML).toBe('0');
  });

  it('should show visits without email', () => {
    // Arrange
    const today = new Date();
    const dateFrom = addDays(today, -1);
    const dateTo = today;
    const visits = 10;
    const loading = false;

    // Act
    const { container, getByText } = render(
      <DopplerIntlProvider>
        <ReportsBox
          dateFrom={dateFrom}
          dateTo={dateTo}
          emailFilter={'without_email'}
          today={today}
          visits={visits}
          loading={loading}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).not.toBeInTheDocument();
    expect(container.querySelector('.number-kpi').innerHTML).toBe('10');
    expect(getByText('reports_box.visits_without_emails'));
  });

  it('should show error message when emailFilter is wrong', () => {
    // Arrange
    const today = new Date();
    const dateFrom = addDays(today, -1);
    const dateTo = today;
    const visits = 10;
    const loading = false;

    // Act
    const { container, getByText } = render(
      <DopplerIntlProvider>
        <ReportsBox
          dateFrom={dateFrom}
          dateTo={dateTo}
          emailFilter={'wrong'}
          today={today}
          visits={visits}
          loading={loading}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('.loading-box')).not.toBeInTheDocument();
    expect(getByText('common.unexpected_error'));
  });
});
