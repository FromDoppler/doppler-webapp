import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KpiGroup } from './KpiGroup';

describe('KpiGroup component', () => {
  it('should render KpiGroup Component when is loading', async () => {
    // Act
    render(<KpiGroup loading={true} />);

    // Assert
    expect(screen.getByTestId('loading-box')).toBeInTheDocument();
  });

  it('should render KpiGroup Component when is not loading', async () => {
    // Act
    render(<KpiGroup loading={false} />);

    // Assert
    expect(screen.queryByTestId('loading-box')).not.toBeInTheDocument();
  });

  it('should render KpiGroup when is disabled', async () => {
    // Arrange
    const props = {
      disabled: true,
      loading: false,
      overlay: <p>lorem ipsum dolor sit amet...</p>,
    };

    // Act
    const { container } = render(<KpiGroup {...props} />);

    // Assert
    expect(container.querySelector('.dp-overlay')).toBeInTheDocument();
    expect(screen.getByText('lorem ipsum dolor sit amet...')).toBeInTheDocument();
  });

  it('should render KpiGroup when is not disabled', async () => {
    // Arrange
    const props = {
      disabled: false,
      loading: false,
      overlay: <p>lorem ipsum dolor sit amet...</p>,
    };

    // Act
    const { container } = render(<KpiGroup {...props} />);

    // Assert
    expect(container.querySelector('.dp-overlay')).not.toBeInTheDocument();
  });
});
