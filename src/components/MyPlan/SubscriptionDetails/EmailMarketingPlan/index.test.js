import { BrowserRouter } from 'react-router-dom';
import { EmailMarketingPlan } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('EmailMarketingPlan component', () => {
  it('should render component - free email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'free',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Prueba Gratuita')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Contactos')).toBeInTheDocument();
  });

  it('should render component - emails email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'monthly_deliveries',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Envíos')).toBeInTheDocument();
  });

  it('should render component - credits email marketing', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'prepaid',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Créditos')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by montly frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 1,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Contactos')).toBeInTheDocument();
    expect(screen.getByText('Mensual')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by quarterly frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 3,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Contactos')).toBeInTheDocument();
    expect(screen.getByText('Trimestral')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by semiannual frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 6,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Contactos')).toBeInTheDocument();
    expect(screen.getByText('Semestral')).toBeInTheDocument();
  });

  it('should render component - contacts email marketing by annual frequency', () => {
    // Assert
    const plan = {
      isFreeAccount: true,
      planType: 'subscribers',
      maxSubscribers: 500,
      itemDescription: 'subscribers',
      remainingCredits: 500,
      planSubscription: 12,
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <EmailMarketingPlan plan={plan} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan por Contactos')).toBeInTheDocument();
    expect(screen.getByText('Anual')).toBeInTheDocument();
  });
});
