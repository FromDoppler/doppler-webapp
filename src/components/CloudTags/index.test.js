import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CloudTags, RemoveButton } from '.';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import { combineValidations } from '../../validations';
import useCloudTags from '../../hooks/useCloudTags';
import { FieldArrayError } from '../form-helpers/CloudTagField';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

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

  it('should add a tag when the add button is clicked and show error if it already exists', async () => {
    // Arrange
    const fieldName = 'subscribers';
    const tagToAdd = 'subscriber_x';
    const max = 4;
    const initialValues = ['subscriber_1', 'subscriber_2'];
    const buttonText = 'add list';
    const onSubmit = jest.fn((values) => values);

    const CloudTagList = ({ fieldName, messageKeys, max }) => {
      const { getAllTags, validateTagToAdd, addTag } = useCloudTags(fieldName, useFormikContext);
      const { errors } = useFormikContext();

      const _customValidationField = (tagToAdd) => validateTagToAdd({ tagToAdd, max, messageKeys });

      const tags = getAllTags();

      return (
        <>
          <FieldArray
            name={fieldName}
            render={({ push, remove }) => {
              const _addTag = () => addTag({ tagToAdd, push, validate: _customValidationField });

              return (
                <CloudTags
                  tags={tags}
                  remove={remove}
                  render={() => (
                    <button
                      type="button"
                      className="dp-button dp-add-list"
                      onClick={_addTag}
                      aria-label="add tag"
                    >
                      <span>+</span>
                      {buttonText}
                    </button>
                  )}
                />
              );
            }}
          />
          <FieldArrayError errors={errors} fieldName={fieldName} />
        </>
      );
    };

    const WrapperComponent = () => (
      <IntlProvider>
        <Formik
          initialValues={{ [fieldName]: initialValues }}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          <Form>
            <CloudTagList fieldName={fieldName} max={max} />
            <button type="submit">Save</button>
          </Form>
        </Formik>
      </IntlProvider>
    );

    // Act
    render(<WrapperComponent />);

    // Assert
    const addButton = screen.getByRole('button', { name: 'add tag' });
    expect(addButton).toBeInTheDocument();

    const initialTags = screen.queryAllByRole('listitem');
    // initialTags.length-1 because the add button is in a listitem
    expect(initialTags.length - 1).toBe(initialValues.length);

    // simulate add tag
    await fireEvent.click(addButton);
    expect(await screen.findByText(tagToAdd)).toBeInTheDocument();
    let addedTags = screen.queryAllByRole('listitem');
    // initialValues.length+1 because the tag was added
    expect(addedTags.length - 1).toBe(initialValues.length + 1);

    // simulate add tag (fail because tag already exist)
    await fireEvent.click(addButton);
    addedTags = screen.queryAllByRole('listitem');
    const errors = screen.getByRole('alert');
    expect(errors).toBeInTheDocument();
    expect(screen.getByText('cloud_tags.tag_already_exist')).toBeInTheDocument();
    // the tag was not added. The number of tags is maintained
    expect(addedTags.length - 1).toBe(initialValues.length + 1);

    // simulate submit form
    const submitButton = screen.getByRole('button', { name: 'Save' });
    await fireEvent.click(submitButton);

    await waitForElementToBeRemoved(screen.getByRole('alert'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({
      [fieldName]: [...initialValues, tagToAdd], // because only one tag was added
    });
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
