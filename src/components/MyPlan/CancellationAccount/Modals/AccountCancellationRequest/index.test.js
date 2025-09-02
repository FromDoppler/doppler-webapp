import { BrowserRouter } from 'react-router-dom';
import { AccountCancellationRequest } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AccountCancellationFlow } from '../../../../../doppler-types';

describe('AccountCancellationRequest component', () => {
  it('should render component - free user', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <AccountCancellationRequest accountCancellationFlow={AccountCancellationFlow.free} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.free_description'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.contact_information_label'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.following_button'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.unsubscribe_button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.schedule_meeting_button'),
    ).not.toBeInTheDocument();
  });

  it('should render component - contact plan greater than or equal to 10000 or montlhy plan', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <AccountCancellationRequest accountCancellationFlow={AccountCancellationFlow.greaterOrEqual1000ContactsOrMonthly} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.contact_emails_description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.contact_information_label'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.following_button'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.unsubscribe_button'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.schedule_meeting_button'),
    ).toBeInTheDocument();
  });

  it('should render component - contact plan less than 10000 or credits plan', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <AccountCancellationRequest accountCancellationFlow={AccountCancellationFlow.lessOrEqual5000ContactsOrCredits} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.cancellation.title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.contact_credits_description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.contact_information_label'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.form.following_button'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.unsubscribe_button'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.cancellation.form.schedule_meeting_button'),
    ).not.toBeInTheDocument();
  });
});