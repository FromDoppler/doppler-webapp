import { render } from '@testing-library/react';
import Notifications from './Notifications';
import '@testing-library/jest-dom/extend-expect';

describe('Bell Notifications test', () => {
  it('Shoud not break if notifications are undefined', () => {
    // Arrange
    const notifications = undefined;
    const emptyNotificationText = 'empty';

    // Act
    const { getByText } = render(
      <Notifications notifications={notifications} emptyNotificationText={emptyNotificationText} />,
    );

    // Assert
    expect(getByText(emptyNotificationText)).toBeInTheDocument();
  });

  it('Shoud not break if notifications are null', () => {
    // Arrange
    const notifications = null;
    const emptyNotificationText = 'empty';

    // Act
    const { getByText } = render(
      <Notifications notifications={notifications} emptyNotificationText={emptyNotificationText} />,
    );

    // Assert
    expect(getByText(emptyNotificationText)).toBeInTheDocument();
  });

  it('Shoud render no notifications text when there aren`t any', () => {
    // Arrange
    const notifications = [];
    const emptyNotificationText = 'empty';

    // Act
    const { getByText } = render(
      <Notifications notifications={notifications} emptyNotificationText={emptyNotificationText} />,
    );

    // Assert
    expect(getByText(emptyNotificationText)).toBeInTheDocument();
  });

  it('Shoud be able to render many notifications', () => {
    // Arrange
    const notifications = ['one', 'two', 'three'];
    const emptyNotificationText = 'empty';

    // Act
    const { getByText } = render(
      <Notifications notifications={notifications} emptyNotificationText={emptyNotificationText} />,
    );

    // Assert
    expect(getByText(notifications[0])).toBeInTheDocument();
    expect(getByText(notifications[1])).toBeInTheDocument();
    expect(getByText(notifications[2])).toBeInTheDocument();
  });

  it('Shoud render n-1 sperators for n notifications', () => {
    // Arrange
    const notifications = ['one', 'two', 'three'];
    const emptyNotificationText = 'empty';

    // Act
    const { container } = render(
      <Notifications notifications={notifications} emptyNotificationText={emptyNotificationText} />,
    );

    // Assert
    expect(container.querySelector('hr')).not.toBeNull();
    expect(container.querySelectorAll('hr').length).toBe(notifications.length - 1);
  });
});
