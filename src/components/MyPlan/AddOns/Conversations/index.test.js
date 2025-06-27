import { BrowserRouter } from 'react-router-dom';
import { Conversations } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Conversations component', () => {
  it('should render component', () => {
    // Assert
    const conversation = {
      plan: {
        buttonText: "COMENZAR",
        buttonUrl: '',
      }
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <Conversations conversation={conversation} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.conversations.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.conversations.description')).toBeInTheDocument();
  });
});
