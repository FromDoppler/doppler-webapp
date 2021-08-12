import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Modal from './Modal';

describe('Modal component', () => {
  const mockedOnClose = jest.fn();
  const dummyText = 'dummy text';

  const ModalComponent = ({ isOpen = true }) => (
    <Modal isOpen={isOpen} handleClose={mockedOnClose}>
      <p>{dummyText}</p>
    </Modal>
  );

  it("should show modal if it's open", async () => {
    // Act
    render(<ModalComponent />);

    // Assert
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(dummyText)).toBeInTheDocument();
  });

  it("shouldn't show modal if it's not open", async () => {
    // Act
    render(<ModalComponent isOpen={false} />);

    // Assert
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    expect(screen.queryByText(dummyText)).not.toBeInTheDocument();
  });

  it('should call handleClose function if close button is pressed', async () => {
    // Act
    render(<ModalComponent />);

    // Assert
    user.click(screen.getByTestId('modal-close'));
    expect(mockedOnClose).toBeCalledTimes(1);
  });
});
