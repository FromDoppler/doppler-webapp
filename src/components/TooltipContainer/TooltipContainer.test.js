import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TooltipContainer } from './TooltipContainer';

describe('TooltipContainer component', () => {
  it('renders visible tooltip when property visible is true', async () => {
    //Arrange
    const visible = true;
    // Act
    const { container } = render(<TooltipContainer visible={visible}></TooltipContainer>);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-tooltip-container .hidden')).not.toBeInTheDocument();
      expect(container.querySelector('.dp-tooltip-container')).toBeInTheDocument();
    });
  });

  it('renders hidden tooltip when property visible is false', async () => {
    //Arrange
    const visible = false;
    // Act
    const { container } = render(<TooltipContainer visible={visible}></TooltipContainer>);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-tooltip-container .hidden')).toBeInTheDocument();
    });
  });

  it('render tooltip has content', async () => {
    //Arrange
    const content = 'some content';
    // Act
    const { container } = render(<TooltipContainer content={content}></TooltipContainer>);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-tooltip-container span')).toHaveTextContent(content);
    });
  });
});
