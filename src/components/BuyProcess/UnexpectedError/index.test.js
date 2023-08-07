import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';
import { UnexpectedError } from '.';

describe('UnexpectedError component', () => {
  it('should render UnexpectedError', async () => {
    // Act
    render(
      <IntlProvider>
        <UnexpectedError />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText('common.unexpected_error')).toBeInTheDocument();
  });
});
