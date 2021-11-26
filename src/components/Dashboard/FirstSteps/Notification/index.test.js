import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Notification } from '.';

const notification = {
  iconClass: 'dp-step--welcome',
  title: 'Welcome! You have already created your account',
  description: 'continue completing the recommended actions that we list below to level up',
};

describe('Notification component', () => {
  it('should render Notification component', () => {
    // Arrange
    const props = {
      ...notification,
    };

    // Act
    render(<Notification {...props} />);

    // Arrange
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(
      screen.getByText(
        /continue completing the recommended actions that we list below to level up/i,
      ),
    ).toBeInTheDocument();
  });
});
