import { BrowserRouter } from 'react-router-dom';
import { ArtificialIntelligenceAgent } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Collaborators component', () => {
  it('should render component', async () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <ArtificialIntelligenceAgent />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.artificial_intelligence_agent.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.artificial_intelligence_agent.description')).toBeInTheDocument();
  });
});
