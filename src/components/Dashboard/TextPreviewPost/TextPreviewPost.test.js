import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TextPreviewPost } from './TextPreviewPost';

describe('TextPreviewPost component', () => {
  it('should show the slide content', async () => {
    // Arrange
    const post = {
      title: 'fake title',
      description: 'fake description',
      link: 'https://localhost:3000/dashboard',
    };

    // Act
    render(<TextPreviewPost post={post} />);

    // Assert
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.description)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', post.link);
  });
});
