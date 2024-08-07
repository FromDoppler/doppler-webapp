import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { Formik, Form } from 'formik';
import {
  FieldGroup,
  FormMessages,
  InputFieldItemAccessible,
  PasswordFieldItem,
  PhoneFieldItemAccessible,
  SubmitButton,
  ValidatedPasswordFieldItem,
} from '../../form-helpers/form-helpers';
import { getFormInitialValues } from '../../../utils';
import { GoBackButton } from '../../BuyProcess/PlanSelection/GoBackButton';

const minLength = {
  min: 2,
  errorMessageKey: 'validation_messages.error_min_length_2',
};

const dummyData = {
  email: 'dummy@fromdoppler.com',
  firstname: 'Test',
  lastname: 'Dummy',
  phone: '+542235859674',
};

const fieldNames = {
  current_password: 'current_password',
  new_password: 'new_password',
  confirm_password: 'confirm_password',
};

export const CollaboratorEditionSection = InjectAppServices(
  ({ dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const accountData = appSessionRef.current.userData.userAccount ?? dummyData;

    useEffect(() => {
      const fetchData = async () => {
        setLoading(false);
      };

      fetchData();
    }, []);

    const validate = (values) => {
      const errors = {};
      if (!values[fieldNames.new_password]) {
        errors[fieldNames.new_password] = { empty: true };
      }
      if (
        values[fieldNames.confirm_password] &&
        values[fieldNames.new_password] !== values[fieldNames.confirm_password]
      ) {
        errors[fieldNames.confirm_password] = 'validation_messages.error_password_match';
      }

      return errors;
    };

    if (loading) {
      return <Loading page />;
    }

    const formikConfig = {
      enableReinitialize: true,
      initialValues: {
        ...accountData,
        ...getFormInitialValues(fieldNames),
      },
      validateOnChange: true,
      validateOnBlur: true,
    };

    return (
      <>
        <Helmet>
          <title>{_('collaborators.meta_title')}</title>
        </Helmet>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <Breadcrumb>
              <BreadcrumbItem
                href={_('common.control_panel_url')}
                text={_('common.control_panel')}
              />
              <BreadcrumbItem
                text={_('control_panel.account_preferences.collaborator_edition_title')}
              />
            </Breadcrumb>
            <h2>{_('control_panel.account_preferences.collaborator_edition_title')}</h2>
          </div>
          <div className="col-sm-7">
            <p>{_('collaborators.edition_subtitle')}</p>
          </div>
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-8 m-t-24 m-b-36">
              <Formik {...formikConfig} validate={validate}>
                <Form className="awa-form signup-form" data-testid="collaborator-edition-form">
                  <fieldset>
                    <FieldGroup>
                      <InputFieldItemAccessible
                        fieldName="email"
                        label={_('signup.label_email')}
                        withSubmitCount={false}
                        disabled={true}
                        type="text"
                      ></InputFieldItemAccessible>
                      <li>
                        <FieldGroup>
                          <InputFieldItemAccessible
                            autoFocus
                            className="field-item--50"
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
                        </FieldGroup>
                      </li>
                    </FieldGroup>
                  </fieldset>
                  <fieldset>
                    <FieldGroup>
                      <PhoneFieldItemAccessible
                        fieldName="phone"
                        label={_('signup.label_phone')}
                        placeholder={_('signup.placeholder_phone')}
                        required="validation_messages.error_phone_required"
                        withSubmitCount={false}
                      />
                    </FieldGroup>
                  </fieldset>
                  <hr className="dp-h-divider m-t-30 m-b-30"></hr>
                  <fieldset>
                    <FieldGroup>
                      <PasswordFieldItem
                        fieldName="current_password"
                        label={_('collaborator_edition.current_password')}
                      />
                      <ValidatedPasswordFieldItem
                        fieldName="new_password"
                        label={_('collaborator_edition.new_password')}
                      />
                      <PasswordFieldItem
                        fieldName="confirm_password"
                        label={_('collaborator_edition.confirm_password')}
                        withSubmitCount={false}
                      />
                    </FieldGroup>
                  </fieldset>
                  <FormMessages />
                  <ul className="dp-group-buttons">
                    <li>
                      <GoBackButton />
                    </li>
                    <li>
                      <SubmitButton>{_('common.next')}</SubmitButton>
                    </li>
                  </ul>
                </Form>
              </Formik>
            </div>
          </div>
        </section>
      </>
    );
  },
);
