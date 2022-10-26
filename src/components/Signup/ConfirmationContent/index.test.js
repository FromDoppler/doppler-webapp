import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ConfirmationContent } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('ConfirmationContent', () => {
  it('should render default content when has not contentAction', async () => {
    // Arrange
    const contentActivation = null;

    // Act
    render(
      <DopplerIntlProvider>
        <ConfirmationContent contentActivation={contentActivation} />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('dinamic-content')).not.toBeInTheDocument();
    screen.getByRole('article');
    screen.getByRole('heading', { level: 1, name: 'signup.thanks_for_registering' });
  });
});
