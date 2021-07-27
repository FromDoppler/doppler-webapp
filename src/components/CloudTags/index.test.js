import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CloudTags, RemoveButton } from '.';

const tags = ['email1@gmail.com', 'email2@gmail.com'];

describe('CloudTags component', () => {
  let remove;
  beforeEach(() => {
    remove = jest.fn();
  });

  it('should render CloudTags component when it has tags', () => {
    // Act
    render(<CloudTags tags={tags} remove={remove} />);

    // Assert
    const allTags = screen.queryAllByRole('listitem');
    expect(allTags.length).toBe(tags.length);
    expect(allTags[allTags.length - 1].querySelector('span')).toHaveClass('dp-recently-add');
  });

  it('should render CloudTags component when it has no tags', () => {
    // Arrange
    const customTags = [];

    // Act
    render(<CloudTags tags={customTags} remove={remove} />);

    // Assert
    const allTags = screen.queryAllByRole('listitem');
    expect(allTags.length).toBe(customTags.length);
  });

  it('should render CloudTags disabled', () => {
    // Arrange
    const disabled = true;

    // Act
    render(<CloudTags tags={tags} remove={remove} disabled={disabled} />);

    // Assert
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render CloudTags with additional tag', () => {
    // Arrange
    const text = 'fake test';
    const AdditionalTag = (props) => (
      <button type="button" className="dp-button dp-add-list">
        <span>+</span>
        {text}
      </button>
    );

    // Act
    render(<CloudTags tags={tags} remove={remove} render={AdditionalTag} />);

    // Assert
    const allTags = screen.queryAllByRole('listitem');
    expect(allTags.length).toBe(tags.length + 1);

    const lastTag = allTags[allTags.length - 1];
    expect(lastTag).toHaveTextContent(text);

    const button = screen.getByText(text);
    expect(button).toHaveClass('dp-add-list');
  });
});

describe('RemoveButton component', () => {
  it('should render RemoveButton component', () => {
    // Arrange
    const removeTag = jest.fn();

    // Act
    render(<RemoveButton removeTag={removeTag} />);

    // Assert
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(removeTag).toHaveBeenCalledTimes(1);
  });
});
