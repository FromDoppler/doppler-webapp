import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Notification } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const notification = {
  iconClass: 'dp-step--welcome',
  titleId: 'dashboard.first_steps.welcome_title',
  descriptionId: 'dashboard.first_steps.welcome_description_MD',
};

describe('Notification component', () => {
  it('should render Notification component', () => {
    // Arrange
    const props = {
      ...notification,
    };

    // Act
    render(
      <IntlProvider>
        <Notification {...props} />
      </IntlProvider>,
    );

    // Arrange
    expect(screen.getByText(props.titleId)).toBeInTheDocument();
    expect(screen.getByText(props.descriptionId)).toBeInTheDocument();
  });
});
