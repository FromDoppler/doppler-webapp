import { useIntl } from 'react-intl';
import {
  FieldGroup,
  FormWithCaptcha,
  InputFieldItem,
  PhoneFieldItem,
  SubmitButton,
} from '../../../../form-helpers/form-helpers';
import { getFormInitialValues } from '../../../../../utils';
import { InjectAppServices } from '../../../../../services/pure-di';
import * as S from './styles';
import { Field } from 'formik';

const fieldNames = {
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  range_time: 'range_time',
  cancellation_reason: 'cancellation_reason',
};

export const CancellationAccountForm = InjectAppServices(({ handleSubmit }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const cancellationReasonOptions = [
    {
      id: 'notAchieveMyExpectedGoals',
      value: 'notAchieveMyExpectedGoals',
      description: _(
        'my_plan.cancellation.form.cancellation_reason_options.not_achieve_my_expected_goals',
      ),
    },
    {
      id: 'myProjectIsOver',
      value: 'myProjectIsOver',
      description: _('my_plan.cancellation.form.cancellation_reason_options.my_project_is_over'),
    },
    {
      id: 'expensiveForMyBudget',
      value: 'expensiveForMyBudget',
      description: _(
        'my_plan.cancellation.form.cancellation_reason_options.doppler_expensive_for_my_budget',
      ),
    },
    {
      id: 'missingFeatures',
      value: 'missingFeatures',
      description: _(
        'my_plan.cancellation.form.cancellation_reason_options.doppler_missing_one_or_more_features',
      ),
    },
    {
      id: 'notWorkingProperly',
      value: 'notWorkingProperly',
      description: _(
        'my_plan.cancellation.form.cancellation_reason_options.doppler_not_working_properly',
      ),
    },
    {
      id: 'others',
      value: 'others',
      description: _('my_plan.cancellation.form.cancellation_reason_options.others'),
    },
  ];

  const _getFormInitialValues = () => {
    const initialValues = getFormInitialValues(fieldNames);

    initialValues[fieldNames.cancellation_reason] = 'notAchieveMyExpectedGoals';

    return initialValues;
  };

  const mapCancellationAccountRequestModel = (values) => {
    const data = {
      Firstname: values.firstname,
      Lastname: values.lastname,
      Phone: values.phone,
      ContactSchedule: values.range_time,
      CancellationReason: values.cancellation_reason,
    };

    return data;
  };

  const onSubmit = async (values) => {
    handleSubmit(mapCancellationAccountRequestModel(values));
  };

  return (
    <section>
      <h4>{_(`my_plan.cancellation.form.contact_information_label`)}</h4>
      <div className="awa-form">
        <FormWithCaptcha onSubmit={onSubmit} initialValues={_getFormInitialValues()}>
          <fieldset>
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
            <S.RadiosContainer id="checkbox-group" className="dp-cancellation-reason-options">
              <h4>{_('my_plan.cancellation.form.cancellation_reason_label')}</h4>
              <Field name={fieldNames.cancellation_reason}>
                {({ field }) => (
                  <ul role="group" aria-labelledby="checkbox-group" className="field-group">
                    {cancellationReasonOptions.map((cancellationReasonOption) => (
                      <li key={cancellationReasonOption.id} className="field-item field-item--50">
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
                <SubmitButton>{_('my_plan.cancellation.form.following_button')}</SubmitButton>
              </li>
            </FieldGroup>
          </fieldset>
        </FormWithCaptcha>
      </div>
    </section>
  );
});
