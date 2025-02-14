import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Carousel } from './Carousel';
import { Slide } from './Slide/Slide';
import { TextPreviewPost } from '../TextPreviewPost/TextPreviewPost';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { learnWithDopplerPosts } from '..';

describe('Carousel component', () => {
  it('should show the slides', async () => {
    // Arrange
    const id = 'fake-id';
    const color = 'fake-color';

    // Act
    const { container } = render(
      <IntlProvider>
        <Carousel id={id} color={color}>
          {(activeSlide) =>
            learnWithDopplerPosts.map((post) => (
              <Slide key={post.id} active={activeSlide}>
                <TextPreviewPost post={post} />
              </Slide>
            ))
          }
        </Carousel>
        ,
      </IntlProvider>,
    );

    // Assert
    learnWithDopplerPosts.forEach((post) =>
      expect(screen.getByText(post.title)).toBeInTheDocument(),
    );
    const element = container.querySelector(`.dp-carousel-${color}`);
    expect(element).toBeInTheDocument();
    const element2 = container.querySelector(`#carousel${id}`);
    expect(element2).toBeInTheDocument();

    const dotInput = container.querySelector(`.dp-carousel-dots input`);
    expect(dotInput).toBeInTheDocument();
    expect(dotInput).toHaveAttribute('checked');
    expect(document.querySelector('.dp-carousel-slide')).toHaveClass(`active`);
  });
});
