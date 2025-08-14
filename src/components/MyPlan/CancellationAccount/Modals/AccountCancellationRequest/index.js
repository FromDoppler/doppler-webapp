import { FormattedMessage, useIntl } from 'react-intl';
import {
  FieldGroup,
  InputFieldItem,
  PhoneFieldItem,
  SubmitButton,
} from '../../../../form-helpers/form-helpers';
import { getFormInitialValues } from '../../../../../utils';
import { InjectAppServices } from '../../../../../services/pure-di';
import * as S from './styles';
import { Field, Form, Formik } from 'formik';

const fieldNames = {
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  range_time: 'range_time',
  cancellation_reason: 'cancellation_reason',
};

export const AccountCancellationRequest = InjectAppServices(
  ({ plan, handleCloseModal, handleSubmit }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const cancellationReasonOptions = [
      {
        id: 'notAchieveMyExpectedGoals',
        value: 'notAchieveMyExpectedGoals',
        description: _(
          'my_plan.cancellation.form.cancellation_reason_options.not_achieve_my_expected_goals',
        ),
        active: true,
      },
      {
        id: 'myProjectIsOver',
        value: 'myProjectIsOver',
        description: _('my_plan.cancellation.form.cancellation_reason_options.my_project_is_over'),
        active: true,
      },
      {
        id: 'expensiveForMyBudget',
        value: 'expensiveForMyBudget',
        description: _(
          'my_plan.cancellation.form.cancellation_reason_options.doppler_expensive_for_my_budget',
        ),
        active: true,
      },
      {
        id: 'missingFeatures',
        value: 'missingFeatures',
        description: _(
          'my_plan.cancellation.form.cancellation_reason_options.doppler_missing_one_or_more_features',
        ),
        active: true,
      },
      {
        id: 'notWorkingProperly',
        value: 'notWorkingProperly',
        description: _(
          'my_plan.cancellation.form.cancellation_reason_options.doppler_not_working_properly',
        ),
        active: true,
      },
      {
        id: 'registeredByMistake',
        value: 'registeredByMistake',
        description: _(
          'my_plan.cancellation.form.cancellation_reason_options.registered_by_mistake',
        ),
        active: plan.isFreeAccount,
      },
      {
        id: 'others',
        value: 'others',
        description: _('my_plan.cancellation.form.cancellation_reason_options.others'),
        active: true,
      },
    ];

    const _getFormInitialValues = () => {
      const initialValues = getFormInitialValues(fieldNames);

      initialValues[fieldNames.cancellation_reason] = 'notAchieveMyExpectedGoals';

      return initialValues;
    };

    const mapCancellationAccountRequestModel = (values) => {
      const data = {
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        contactSchedule: values.range_time,
        cancellationReason: values.cancellation_reason,
      };

      return data;
    };

    const onSubmit = async (values) => {
      handleSubmit(mapCancellationAccountRequestModel(values));
    };

    return (
      <div className="modal" id="modal-cancel-subscription">
        <div className="modal-content--medium">
          <span className="close" onClick={handleCloseModal}></span>
          <h2 className="modal-title">{_(`my_plan.cancellation.title`)}</h2>
          <p>
            <FormattedMessage
              id={`my_plan.cancellation.${plan.isFreeAccount ? 'free' : ''}_description`}
              values={{
                Strong: (chunks) => <strong>{chunks}</strong>,
              }}
            />
          </p>
          <section>
            {!plan.isFreeAccount && (
              <h4>{_(`my_plan.cancellation.form.contact_information_label`)}</h4>
            )}
            <div className="awa-form">
              <Formik onSubmit={onSubmit} initialValues={_getFormInitialValues()}>
                {({ isSubmitting }) => (
                  <Form className="dp-form-billing-information">
                    <fieldset>
                      {!plan.isFreeAccount && (
                        <>
                          <FieldGroup>
                            <InputFieldItem
                              type="text"
                              fieldName={fieldNames.firstname}
                              id="firstname"
                              label={_('my_plan.cancellation.form.firstname_label')}
                              withNameValidation
                              required
                              className="field-item--50"
                            />
                            <InputFieldItem
                              type="text"
                              label={_('my_plan.cancellation.form.lastname_label')}
                              fieldName={fieldNames.lastname}
                              id="lastname"
                              withNameValidation
                              required
                              className="field-item--50"
                            />
                          </FieldGroup>
                          <FieldGroup>
                            <InputFieldItem
                              fieldName={fieldNames.range_time}
                              type="text"
                              label={_('my_plan.cancellation.form.contact_schedule_label')}
                              id="range_time"
                              className="field-item--50"
                              required
                            />
                            <PhoneFieldItem
                              fieldName={fieldNames.phone}
                              label={_('my_plan.cancellation.form.phone_label')}
                              placeholder={_('my_plan.cancellation.form.phone_placeholder')}
                              className="field-item--50"
                              required
                            />
                          </FieldGroup>
                        </>
                      )}
                      <S.RadiosContainer
                        id="checkbox-group"
                        className="dp-cancellation-reason-options"
                      >
                        <h4>{_('my_plan.cancellation.form.cancellation_reason_label')}</h4>
                        <Field name={fieldNames.cancellation_reason}>
                          {({ field }) => (
                            <ul
                              role="group"
                              aria-labelledby="checkbox-group"
                              className="field-group"
                            >
                              {cancellationReasonOptions
                                .filter((cr) => cr.active === true)
                                .map((cancellationReasonOption) => (
                                  <li
                                    key={cancellationReasonOption.id}
                                    className="field-item field-item--50"
                                  >
                                    <div className="dp-input--radio">
                                      <label>
                                        <input
                                          id={cancellationReasonOption.id}
                                          type="radio"
                                          name={fieldNames.cancellation_reason}
                                          {...field}
                                          value={cancellationReasonOption.value}
                                          checked={field.value === cancellationReasonOption.value}
                                          required
                                        />
                                        <span>{cancellationReasonOption.description}</span>
                                      </label>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </Field>
                      </S.RadiosContainer>
                      <hr />
                      <FieldGroup className="dp-group-buttons">
                        <li>
                          <SubmitButton isSubmitting={isSubmitting}>
                            {_('my_plan.cancellation.form.following_button')}
                          </SubmitButton>
                        </li>
                      </FieldGroup>
                    </fieldset>
                  </Form>
                )}
              </Formik>
            </div>
          </section>
        </div>
      </div>
    );
  },
);
