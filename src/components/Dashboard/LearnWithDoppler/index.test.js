import React from 'react';
import { getByText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakePostList, LearnWithDoppler } from '.';

describe('LearnWithDoppler component', () => {
  it('should render blog carousel', async () => {
    // Act
    render(
      <IntlProvider>
        <LearnWithDoppler />
      </IntlProvider>,
    );

    // Assert
    const carousel = screen.getByRole('region', { name: 'blog' });
    fakePostList.blog.forEach((post) => {
      expect(getByText(carousel, post.title));
    });
  });

  it('should render help carousel', async () => {
    // Act
    render(
      <IntlProvider>
        <LearnWithDoppler />
      </IntlProvider>,
    );

    // Assert
    const carousel = screen.getByRole('region', { name: 'help' });
    fakePostList.help.forEach((post) => {
      expect(getByText(carousel, post.title));
    });
  });
});
