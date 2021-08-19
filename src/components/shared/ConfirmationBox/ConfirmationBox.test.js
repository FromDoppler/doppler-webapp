import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { ConfirmationBox } from './ConfirmationBox';

describe('ConfirmationBox component', () => {
  const texts = {
    title: 'a title',
    description: 'some description',
    cancelButtonText: 'cancel',
    actionButtonText: 'action',
  };

  const logo = 'logo.svg';
  const paragraph = 'an strong text';
  const mockedOnCancel = jest.fn();
  const mockedOnAction = jest.fn();

  const ConfirmationBoxComponent = () => (
    <ConfirmationBox
      logo={logo}
      paragraph={paragraph}
      {...texts}
      onCancel={mockedOnCancel}
      onAction={mockedOnAction}
    />
  );

  it('should render component', () => {
    // Act
    render(<ConfirmationBoxComponent />);

    // Assert
    Object.values(texts).map((text) => expect(screen.getByText(text)).toBeInTheDocument());
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining(logo));
    expect(screen.getByText(paragraph)).toBeInTheDocument();
  });

  it('should render component without paragraph', () => {
    // Act
    render(
      <ConfirmationBox
        logo={logo}
        {...texts}
        onCancel={mockedOnCancel}
        onAction={mockedOnAction}
      />,
    );

    // Assert
    Object.values(texts).map((text) => expect(screen.getByText(text)).toBeInTheDocument());
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining(logo));
    expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
  });

  it('should call onCancel function if cancel button is pressed ', async () => {
    // Act
    render(<ConfirmationBoxComponent />);

    // Assert
    // Should call onCancel function
    const cancelButton = screen.getByRole('button', { name: texts.cancelButtonText });
    user.click(cancelButton);
    expect(mockedOnCancel).toBeCalledTimes(1);
  });

  it('should call onAction function if action button is pressed ', async () => {
    // Act
    render(<ConfirmationBoxComponent />);

    // Assert
    // Should call onAction function
    const actionButton = screen.getByRole('button', { name: texts.actionButtonText });
    user.click(actionButton);
    expect(mockedOnAction).toBeCalledTimes(1);
  });
});
