import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PreviewPost from './PreviewPost';

describe('PreviewPost component', () => {
  it('should show the slide content', async () => {
    // Act
    render(<PreviewPost post />);

    // Assert
    const title = document.querySelector('h3');
    const description = document.querySelector('p');
    const link = document.querySelector('a');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });
});
