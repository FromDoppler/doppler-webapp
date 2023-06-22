import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Slider, Tickmarks } from '.';
import { BrowserRouter } from 'react-router-dom';

describe('Slider component', () => {
  it('should render Slider component', async () => {
    // Arrange
    const items = ['500', '1k', '5k', '20k', '100k'];
    const selectedItemIndex = 0;
    const handleChange = jest.fn();
    const moreOptions = {
      label: 'More than 100k',
      relativePath: '/plan-selection/by-emails',
    };

    // Act
    render(
      <BrowserRouter>
        <Slider
          items={items}
          selectedItemIndex={selectedItemIndex}
          handleChange={handleChange}
          moreOptions={moreOptions}
        />
        ,
      </BrowserRouter>,
    );

    // Assert
    const slider = screen.getByRole('slider');
    expect(slider.value).toEqual('0');
    expect(slider.min).toEqual('0');
    expect(slider.max).toEqual(`${items.length - 1}`);
    expect(screen.getByRole('link', { name: moreOptions.label })).toHaveAttribute(
      'href',
      moreOptions.relativePath,
    );
  });

  it('should render Slider component when is disabled', async () => {
    // Arrange
    const items = [];
    const selectedItemIndex = null;
    const handleChange = jest.fn();

    // Act
    render(<Slider items={items} handleChange={handleChange} />);

    // Assert
    const slider = screen.getByRole('slider');
    expect(slider.disabled).toEqual(true);
  });
});

describe('Tickmarks component', () => {
  it('should render Tickmarks component', async () => {
    // Arrange
    const items = ['500', '1k', '5k', '20k', '100k'];
    const handleChange = jest.fn();

    // Act
    render(<Tickmarks items={items} handleChange={handleChange} hideMarksFrom={6} />);

    // Assert
    items.forEach((item) => {
      screen.getByText(item);
    });
  });

  it('should render Tickmarks component when is visible just the first item and the last item', async () => {
    // Arrange
    const items = ['500', '1k', '5k', '20k', '100k'];
    const handleChange = jest.fn();

    // Act
    render(<Tickmarks items={items} handleChange={handleChange} hideMarksFrom={3} />);

    // Assert
    items.forEach((item, index) => {
      if ([0, items.length - 1].includes(index)) {
        screen.getByText(item);
      } else {
        expect(screen.queryByText(item)).not.toBeInTheDocument();
      }
    });
  });
});
