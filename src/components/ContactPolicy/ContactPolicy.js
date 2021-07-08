import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../shared/Breadcrumb/Breadcrumb';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import {
  FieldGroup,
  FieldItem,
  NumberField,
  SubmitButton,
  SwitchField,
} from '../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';

export const ContactPolicy = InjectAppServices(
  ({ dependencies: { dopplerContactPolicyApiClient, appSessionRef, experimentalFeatures } }) => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const isContactPolicyEnabled =
      experimentalFeatures && experimentalFeatures.getFeature('ContactPolicy');
    const fieldNames = {
      active: 'active',
      emailsAmountByInterval: 'emailsAmountByInterval',
      intervalInDays: 'intervalInDays',
    };

    const getFormInitialValues = () => {
      const initialValues = Object.keys(fieldNames).reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue]: '',
        }),
        {},
      );

      return { ...initialValues, ...settings };
    };

    useEffect(() => {
      if (isContactPolicyEnabled) {
        const fetchData = async () => {
          setLoading(true);
          const { success, value } = await dopplerContactPolicyApiClient.getAccountSettings();
          if (success) {
            setSettings(value);
          } else {
            setSettings(undefined);
            console.log('Error getting account settings');
          }
          setLoading(false);
        };
        fetchData();
      }
    }, [isContactPolicyEnabled, dopplerContactPolicyApiClient, appSessionRef]);

    const submitContactPolicyForm = async (values, { setSubmitting }) => {
      setFormSubmitted(false);
      try {
        const { success } = await dopplerContactPolicyApiClient.updateAccountSettings(values);
        if (!success) {
          console.log('Error updating account settings');
        }
        setFormSubmitted(success);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <>
        <Helmet>
          <title>{_('contact_policy.meta_title')}</title>
        </Helmet>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <Breadcrumb>
              <BreadcrumbItem
                href={_('common.control_panel_url')}
                text={_('common.control_panel')}
              />
              <BreadcrumbItem text={_('contact_policy.title')} />
            </Breadcrumb>
            <h2>{_('contact_policy.title')}</h2>
            <FormattedMessageMarkdown linkTarget={'_blank'} id="contact_policy.subtitle_MD" />
          </div>
        </HeaderSection>
        <section className="dp-container">
          {isContactPolicyEnabled ? (
            loading ? (
              <Loading page />
            ) : (
              <div className="dp-rowflex">
                <div className="col-lg-6 col-md-12 col-sm-12 m-b-24">
                  <Formik onSubmit={submitContactPolicyForm} initialValues={getFormInitialValues()}>
                    {({ values, handleChange }) => (
                      <Form className="dp-contact-policy-form">
                        <fieldset>
                          <legend>{_('contact_policy.title')}</legend>
                          <FieldGroup>
                            <FieldItem className="field-item">
                              <SwitchField
                                id="contact-policy-switch"
                                name={fieldNames.active}
                                text={_('contact_policy.toggle_text')}
                                onChange={(value) => {
                                  handleChange(value);
                                  setFormSubmitted(false);
                                }}
                              />
                            </FieldItem>

                            <FieldItem className="field-item">
                              <div className="dp-item-block">
                                <div>
                                  <span>{_('contact_policy.amount_description')}</span>
                                  <NumberField
                                    name={fieldNames.emailsAmountByInterval}
                                    id="contact-policy-input-amount"
                                    disabled={!values[fieldNames.active]}
                                    required
                                  />
                                  <span className="m-r-6">{_('common.emails')}</span>
                                </div>
                                <div>
                                  <span>{_('contact_policy.interval_description')}</span>
                                  <NumberField
                                    name={fieldNames.intervalInDays}
                                    id="contact-policy-input-interval"
                                    disabled={!values[fieldNames.active]}
                                    required
                                  />
                                  <span>{_('contact_policy.interval_unit')}</span>
                                </div>
                              </div>
                            </FieldItem>

                            {formSubmitted ? (
                              <FieldItem className="field-item">
                                <div className="dp-wrap-message dp-wrap-success bounceIn">
                                  <span className="dp-message-icon" />
                                  <div className="dp-content-message">
                                    <p>{_('contact_policy.success_msg')}</p>
                                  </div>
                                </div>
                              </FieldItem>
                            ) : null}

                            <FieldItem className="field-item">
                              <hr />
                            </FieldItem>

                            <FieldItem className="field-item">
                              <a
                                href={_('common.control_panel_url')}
                                className="dp-button button-medium primary-grey"
                              >
                                {_('common.back')}
                              </a>

                              <span className="align-button m-l-24">
                                <SubmitButton>{_('common.save')}</SubmitButton>
                              </span>
                            </FieldItem>
                          </FieldGroup>
                        </fieldset>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )
          ) : (
            <div className="col-sm-12 col-md-8 col-lg-6 m-b-12">
              <div className="dp-wrap-message dp-wrap-info">
                <span className="dp-message-icon" />
                <div className="dp-content-message">
                  <p>
                    <FormattedMessage id="common.feature_no_available" />
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    );
  },
);
