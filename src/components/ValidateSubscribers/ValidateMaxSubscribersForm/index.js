import { Field, Form, Formik } from 'formik';
import {
  FieldGroup,
  InputFieldItem,
  SubmitButton,
  CheckboxFieldItem,
} from '../../form-helpers/form-helpers';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const ValidateMaxSubscribersForm = ({ validationFormData, handleClose, handleSubmit }) => {
  const [show, setShow] = useState(false);

  const isCheckbox = (answer) => {
    return answer.answerType === 'CHECKBOX_WITH_TEXTAREA' || answer.answerType === 'CHECKBOX';
  };

  const answers = {};
  validationFormData.questionsList?.forEach((question, index) => {
    answers[`answer${index}`] = isCheckbox(question.answer) ? [] : '';
    if (question.answer?.answerType === 'CHECKBOX_WITH_TEXTAREA') {
      answers[`answer${index}_text`] = '';
    }
  });

  const onSubmit = async (values, { setSubmitting }) => {
    validationFormData.questionsList.forEach((questionItem, index) => {
      if (isCheckbox(questionItem.answer)) {
        questionItem.answer.value = values[`answer${index}`].join('-');
        questionItem.answer.text = values[`answer${index}_text`];
      } else {
        questionItem.answer.value = values[`answer${index}`];
      }
    });
    const result = await handleSubmit();
    if (!result) {
      setSubmitting(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    for (let value in values) {
      if (Array.isArray(values[value]) && values[value].length === 0) {
        errors[value] = 'validate_max_subscribers_form.checkbox_empty';
      }
    }
    return errors;
  };

  const renderQuestions = (questionItem, questionIndex, formikProps) => {
    const { touched, errors, submitCount } = formikProps;
    if (
      questionItem.answer?.answerType === 'TEXTFIELD' ||
      questionItem.answer?.answerType === 'URL'
    ) {
      return (
        <InputFieldItem
          type="text"
          label={questionItem.question}
          fieldName={`answer${questionIndex}`}
          required
          className={`${questionItem.answer?.answerType === 'TEXTFIELD' ? 'field-item--50' : ''}`}
        />
      );
    }

    if (isCheckbox(questionItem.answer)) {
      let fieldName = `answer${questionIndex}`;
      return (
        <li className="m-t-6">
          <fieldset>
            <label htmlFor={questionItem.question}>{questionItem.question}</label>
            <FieldGroup>
              {questionItem.answer.answerOptions.map((option, optionIndex) => {
                const lastCheckboxItem =
                  questionItem.answer?.answerType === 'CHECKBOX_WITH_TEXTAREA' &&
                  questionItem.answer?.answerOptions.length - 1 === optionIndex;
                return (
                  <React.Fragment key={`checkbox${optionIndex}`}>
                    <CheckboxFieldItem
                      className={'field-item--50'}
                      label={option}
                      fieldName={fieldName}
                      id={`${fieldName}-${optionIndex}`}
                      value={option}
                      onClick={lastCheckboxItem ? toggleOthers : undefined}
                      withErrors={false}
                    />
                    {lastCheckboxItem ? (
                      <div
                        className={`${show ? 'dp-show' : 'dp-hide'}`}
                        data-testid="last-textarea"
                      >
                        <Field
                          as="textarea"
                          name={`answer${questionIndex}_text`}
                          className={'field-item'}
                        />
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
              {submitCount && touched[fieldName] && errors[fieldName] ? (
                <li className="field-item error">
                  <div className="dp-message dp-error-form">
                    <p>
                      <FormattedMessage id={`${errors[fieldName]}`} />
                    </p>
                  </div>
                </li>
              ) : null}
            </FieldGroup>
          </fieldset>
        </li>
      );
    }
  };

  const toggleOthers = () => {
    setShow(!show);
  };

  return (
    <section className="dp-container">
      <div className="dp-wrapper-form-plans">
        <h2 className="modal-title">
          <FormattedMessage id="validate_max_subscribers_form.title" />
        </h2>
        <p>
          <FormattedMessage id="validate_max_subscribers_form.subtitle" />
        </p>
        <Formik initialValues={answers} validate={validate} onSubmit={onSubmit}>
          {(formikProps) => (
            <Form className="dp-validate-max-subscribers">
              <fieldset>
                <legend>
                  <FormattedMessage id="validate_max_subscribers_form.title" />
                </legend>
                <FieldGroup>
                  {validationFormData.questionsList?.map((questionItem, questionIndex) => (
                    <React.Fragment key={`question${questionIndex}`}>
                      {renderQuestions(questionItem, questionIndex, formikProps)}
                    </React.Fragment>
                  ))}
                </FieldGroup>
                <p>
                  <i>
                    <FormattedMessage id="validate_max_subscribers_form.form_help" />{' '}
                    <a target="_BLANK" href={validationFormData?.urlHelp}>
                      <FormattedMessage id="validate_max_subscribers_form.form_help_link_text" />
                      <br />
                    </a>
                    <FormattedMessage id="validate_max_subscribers_form.info_text" />
                  </i>
                </p>
                <div className="dp-container">
                  <div className="dp-rowflex">
                    <div className="dp-footer-form">
                      <button
                        type="button"
                        className="dp-button button-medium primary-grey m-r-6"
                        onClick={handleClose}
                      >
                        <FormattedMessage id="common.cancel" />
                      </button>
                      <SubmitButton className="dp-button button-medium primary-green">
                        <FormattedMessage id="common.save" />
                      </SubmitButton>
                    </div>
                  </div>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
