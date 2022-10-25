import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Promotions from './Promotions';

describe('Promotions Component', () => {
  it('should render loading component', async () => {
    // arrange
    const props = {
      loading: true,
      bannerData: null,
    };

    // act
    render(<Promotions {...props} />);

    // assert
    screen.getByTestId('loading-box');
    expect(screen.queryByRole('heading', { lavel: 1 })).not.toBeInTheDocument();
  });

  it('should render Promotion component when has bannerData', async () => {
    // arrange
    const props = {
      loading: false,
      bannerData: {
        title: 'default_banner_data.title',
        description: 'default_banner_data.description',
        backgroundUrl: 'default_banner_data.background_url',
        imageUrl: 'default_banner_data.image_url',
        functionality: 'default_banner_data.functionality',
        fontColor: '#FFF',
      },
    };

    // act
    render(<Promotions {...props} />);

    // assert
    expect(screen.queryByTestId('loading-box')).not.toBeInTheDocument();
    screen.getByRole('heading', { level: 1, name: props.bannerData.title });
  });
});
