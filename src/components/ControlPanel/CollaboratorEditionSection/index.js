import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, Form, Formik } from 'formik';
import { Navigate } from 'react-router-dom';

import { InjectAppServices } from '../../../services/pure-di';
import { getFormInitialValues } from '../../../utils';
import { validatePassword } from '../../../validations';
import { GoBackButton } from '../../BuyProcess/PlanSelection/GoBackButton';
import {
  FieldGroup,
  FieldItemAccessible,
  FormMessages,
  InputFieldItemAccessible,
  PasswordFieldItem,
  PhoneFieldItemAccessible,
  SubmitButton,
} from '../../form-helpers/form-helpers';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

const minLength = {
  min: 2,
  errorMessageKey: 'validation_messages.error_min_length_2',
};

const fieldNames = {
  current_password: 'current_password',
  new_password: 'new_password',
  confirm_password: 'confirm_password',
};

const languageOptions = [
  { key: 'es', labelId: 'collaborator_edition.language_spanish' },
  { key: 'en', labelId: 'collaborator_edition.language_english' },
];

const CollapsibleSection = ({ title, isOpen, onToggle, children, status }) => (
  <li className={isOpen ? 'active' : ''}>
    <button
      type="button"
      className="dp-accordion-thumb"
      aria-expanded={isOpen}
      onClick={onToggle}
      style={{ borderTop: '1px solid #ccc' }}
    >
      <span className="dp-accordion-header">
        <span>{title}</span>
        {status ? (
          <span className="pill pill--green">
            <span className="pill-text">{status}</span>
          </span>
        ) : null}
        <span className="dp-accordion-icon" aria-hidden="true" />
      </span>
    </button>
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="dp-accordion-content">{children}</div>
    </div>
  </li>
);

export const CollaboratorEditionSection = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerUserApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id }, values);

    const accountData = appSessionRef.current.userData.userAccount;
    const redirectToDashboard =
      appSessionRef.current.userData.userAccount?.userProfileType &&
      appSessionRef.current.userData.userAccount.userProfileType !== 'COLLABORATOR';

    const [isPersonalDataOpen, setIsPersonalDataOpen] = useState(true);
    const [isPasswordOpen, setIsPasswordOpen] = useState(true);
    const [isAccountReportsOpen, setIsAccountReportsOpen] = useState(true);

    const toggleAccordionSection = (setSectionState) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent?.stopImmediatePropagation?.();
      setSectionState((current) => !current);
    };

    const validate = (values) => {
      const errors = {};

      if (values[fieldNames.new_password] !== values[fieldNames.confirm_password]) {
        errors[fieldNames.confirm_password] = 'validation_messages.error_password_match';
      }

      if (
        values[fieldNames.current_password] &&
        (!values[fieldNames.new_password] || !values[fieldNames.confirm_password])
      ) {
        errors[fieldNames.new_password] = 'validation_messages.error_password_missing';
      }

      if (values[fieldNames.new_password]) {
        const error = validatePassword(values[fieldNames.new_password]);

        if (!error || error.empty) {
          return errors;
        }

        if (error.charLength || error.digit || error.letter) {
          errors[fieldNames.new_password] = 'validation_messages.error_password_format';
        }
      }

      return errors;
    };

    const formikConfig = {
      enableReinitialize: true,
      initialValues: {
        email: accountData?.email || '',
        language: intl.locale?.startsWith('en') ? 'en' : 'es',
        firstname: accountData?.firstName || accountData?.firstname || '',
        lastname: accountData?.lastName || accountData?.lastname || '',
        phone: accountData?.phone || '',
        weekly_account_report_enabled: true,
        ...getFormInitialValues(fieldNames),
      },
      validateOnChange: true,
      validateOnBlur: true,
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
      const body = {
        Firstname: values.firstname,
        Lastname: values.lastname,
        Phone: values.phone,
        CurrentPassword: values.current_password,
        NewPassword: values.new_password,
      };

      const response = await dopplerUserApiClient.updateUserAccountInformation(body);

      if (response.success) {
        setErrors({
          _success: 'contact_policy.success_msg',
        });
      } else {
        response.error.response.data && response.error.response.data.errorCode === 1
          ? setErrors({
              [fieldNames.current_password]: 'validation_messages.error_password_invalid',
            })
          : setErrors({
              _error: 'common.something_wrong',
            });
      }

      setSubmitting(false);
    };

    if (redirectToDashboard || !accountData) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <>
        <Helmet>
          <title>{_('control_panel.account_preferences.account_information_title')}</title>
        </Helmet>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <Breadcrumb>
              <BreadcrumbItem
                href={_('common.control_panel_url')}
                text={_('common.control_panel')}
              />
              <BreadcrumbItem
                text={_('control_panel.account_preferences.account_information_title')}
              />
            </Breadcrumb>
            <h2>{_('control_panel.account_preferences.account_information_title')}</h2>
          </div>
          <div className="col-sm-7">
            <p>{_('collaborators.edition_subtitle')}</p>
            <p>{_('collaborators.edition_subtitle_reminder')}</p>
          </div>
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-6 m-b-36">
              <Formik {...formikConfig} validate={validate} onSubmit={handleSubmit}>
                <Form data-testid="collaborator-edition-form">
                  <div className="awa-form signup-form" style={{ margin: '0px' }}>
                    <FieldGroup className="dp-rowflex">
                      <InputFieldItemAccessible
                        className="col-sm-12"
                        fieldName="email"
                        label={_('signup.label_email')}
                        withSubmitCount={false}
                        disabled
                        type="text"
                      />
                      <FieldItemAccessible className="col-sm-12 m-b-0">
                        <label htmlFor="language" className="labelcontrol">
                          {`${_('collaborator_edition.language')}:`}
                          <div className="dp-select">
                            <span className="dropdown-arrow" />
                            <Field as="select" id="language" name="language">
                              {languageOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                  {_(option.labelId)}
                                </option>
                              ))}
                            </Field>
                          </div>
                        </label>
                      </FieldItemAccessible>
                    </FieldGroup>
                    <ul className="dp-accordion dp-accordion-control-panel">
                      <CollapsibleSection
                        title={_('collaborator_edition.personal_data_title')}
                        isOpen={isPersonalDataOpen}
                        onToggle={toggleAccordionSection(setIsPersonalDataOpen)}
                      >
                        <FieldGroup>
                          <InputFieldItemAccessible
                            autoFocus
                            className="field-item--50 dp-p-r"
                            fieldName="firstname"
                            label={_('signup.label_firstname')}
                            placeholder={_('signup.placeholder_first_name')}
                            type="text"
                            minLength={minLength}
                            required
                            withNameValidation
                            withSubmitCount={false}
                          />
                          <InputFieldItemAccessible
                            className="field-item--50"
                            fieldName="lastname"
                            label={_('signup.label_lastname')}
                            placeholder={_('signup.placeholder_last_name')}
                            type="text"
                            minLength={minLength}
                            required
                            withNameValidation
                            withSubmitCount={false}
                          />
                          <PhoneFieldItemAccessible
                            className="m-b-0"
                            fieldName="phone"
                            label={_('signup.label_phone')}
                            placeholder={_('signup.placeholder_phone')}
                            required="validation_messages.error_phone_required"
                            withSubmitCount={false}
                          />
                        </FieldGroup>
                      </CollapsibleSection>
                      <CollapsibleSection
                        title={_('collaborator_edition.change_password_title')}
                        isOpen={isPasswordOpen}
                        onToggle={toggleAccordionSection(setIsPasswordOpen)}
                      >
                        <FieldGroup>
                          <PasswordFieldItem
                            fieldName="current_password"
                            label={_('collaborator_edition.current_password')}
                          />
                          <PasswordFieldItem
                            fieldName="new_password"
                            label={_('collaborator_edition.new_password')}
                          />
                          <PasswordFieldItem
                            fieldName="confirm_password"
                            label={_('collaborator_edition.confirm_password')}
                          />
                        </FieldGroup>
                      </CollapsibleSection>
                      <CollapsibleSection
                        title={_('collaborator_edition.account_reports_title')}
                        status={_('collaborator_edition.account_reports_status_active')}
                        isOpen={isAccountReportsOpen}
                        onToggle={toggleAccordionSection(setIsAccountReportsOpen)}
                      >
                        <div className="dp-text-switch m-t-12">
                          <div className="dp-switch">
                            <Field
                              type="checkbox"
                              id="weekly_account_report_enabled"
                              name="weekly_account_report_enabled"
                            />
                            <label htmlFor="weekly_account_report_enabled">
                              <span />
                            </label>
                          </div>
                          <div className="m-l-12">
                            <p className="m-b-12">
                              <strong>
                                {_('collaborator_edition.account_reports_weekly_label')}
                              </strong>
                            </p>
                            <p className="m-b-12">
                              {_('collaborator_edition.account_reports_weekly_description')}
                            </p>
                            <p className="m-b-0">
                              <FormattedMessage
                                id="collaborator_edition.account_reports_weekly_note"
                                values={{
                                  strong: (chunks) => <strong>{chunks}</strong>,
                                }}
                              />
                            </p>
                          </div>
                        </div>
                      </CollapsibleSection>
                    </ul>

                    <FormMessages />

                    <ul className="dp-group-buttons">
                      <li>
                        <GoBackButton />
                      </li>
                      <li>
                        <SubmitButton>{_('common.save')}</SubmitButton>
                      </li>
                    </ul>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </section>
      </>
    );
  },
);
