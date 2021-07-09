import { fireEvent, render } from '@testing-library/react';
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
    const { container } = render(<CloudTags tags={tags} remove={remove} />);

    // Assert
    const allTags = container.querySelectorAll('.dp-cloud-tags .dp-tag');
    expect(allTags.length).toBe(tags.length);
    expect(allTags[allTags.length - 1]).toHaveClass('dp-recently-add');
  });

  it('should render CloudTags component when it has no tags', () => {
    // Arrange
    const customTags = [];

    // Act
    const { container } = render(<CloudTags tags={customTags} remove={remove} />);

    // Assert
    const allTags = container.querySelectorAll('.dp-cloud-tags .dp-tag');
    expect(allTags.length).toBe(customTags.length);
  });

  it('should render CloudTags disabled', () => {
    // Arrange
    const disabled = true;

    // Act
    const { container } = render(<CloudTags tags={tags} remove={remove} disabled={disabled} />);

    // Assert
    expect(container.querySelector('.dp-cloud-tags.dp-overlay')).toBeInTheDocument();
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
    const { container, getByText } = render(
      <CloudTags tags={tags} remove={remove} additionalTagProps={{}} render={AdditionalTag} />,
    );

    // Assert
    const allTags = container.querySelectorAll('ul>li');
    expect(allTags.length).toBe(tags.length + 1);

    const lastTag = allTags[allTags.length - 1];
    expect(lastTag).toHaveTextContent(text);

    const button = getByText(text);
    expect(button).toHaveClass('dp-add-list');
  });
});

describe('RemoveButton component', () => {
  it('should render RemoveButton component', () => {
    // Arrange
    const removeTag = jest.fn();

    // Act
    const { getByRole } = render(<RemoveButton removeTag={removeTag} />);

    // Assert
    const button = getByRole('button');
    fireEvent.click(button);
    expect(removeTag).toHaveBeenCalledTimes(1);
  });
});
