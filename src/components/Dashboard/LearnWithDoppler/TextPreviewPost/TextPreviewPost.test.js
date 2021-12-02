import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TextPreviewPost } from './TextPreviewPost';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('TextPreviewPost component', () => {
  it('should show the slide content', async () => {
    // Arrange
    const post = {
      title: 'dashboard.postListBlog_1_title',
      description: 'dashboard.postListBlog_1_description',
      link: 'dashboard.postListBlog_1_link',
      linkDescription: 'dashboard.postListBlog_1_link_description',
    };

    // Act
    render(
      <IntlProvider>
        <TextPreviewPost post={post} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.description)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', post.link);
  });
});
