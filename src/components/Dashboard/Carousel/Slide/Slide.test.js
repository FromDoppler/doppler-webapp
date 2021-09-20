import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Slide from './Slide';

describe('Slide component', () => {
  it('should show the slide', async () => {
    render(<Slide title="texto" description="desc" link="linkurl" />);
    const title = screen.getByText('texto');
    const description = screen.getByText('desc');
    const link = screen.getByRole('link');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });
});
