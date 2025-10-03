import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import { PlanAlert } from './planAlert';

const messages = new Proxy(
  {},
  {
    get: (_, id) => id,
  },
);

const renderWithProviders = (ui) =>
  render(
    <IntlProvider locale="en" messages={messages}>
      <BrowserRouter>{ui}</BrowserRouter>
    </IntlProvider>,
  );

describe('PlanAlert component', () => {
  it('should return null if not trial and availableSends > 0', () => {
    const { container } = renderWithProviders(
      <PlanAlert days={10} availableSends={100} isPlanTrial={false} linkUrl="/upgrade" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show excess shipments message when availableSends < 0', () => {
    renderWithProviders(
      <PlanAlert days={10} availableSends={-5} isPlanTrial={false} linkUrl="/upgrade" />,
    );

    expect(screen.getByText('push_notification_section.panel.exceeded')).toBeInTheDocument();
    expect(screen.getByText('push_notification_section.panel.exceeded2')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'push_notification_section.panel.change_plan',
      }),
    ).toHaveAttribute('href', '/upgrade');
  });

  it('should show trial ended message when trial expired', () => {
    renderWithProviders(
      <PlanAlert days={0} availableSends={0} isPlanTrial={true} linkUrl="/buy" />,
    );

    expect(
      screen.getByText('push_notification_section.panel.date_expiration_error'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'push_notification_section.panel.purchase_plan',
      }),
    ).toHaveAttribute('href', '/buy');
  });

  it('should show countdown plural when days > 1', () => {
    renderWithProviders(
      <PlanAlert days={5} availableSends={100} isPlanTrial={true} linkUrl="/buy" />,
    );

    expect(
      screen.getByText('push_notification_section.panel.countdown_message_plural'),
    ).toBeInTheDocument();
  });

  it('should show countdown singular when days === 1', () => {
    renderWithProviders(
      <PlanAlert days={1} availableSends={100} isPlanTrial={true} linkUrl="/buy" />,
    );

    expect(
      screen.getByText('push_notification_section.panel.countdown_message_singular'),
    ).toBeInTheDocument();
  });
});
