import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../shared/Breadcrumb/Breadcrumb';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import {
  FieldGroup,
  IconMessage,
  NumberField,
  SwitchField,
  WrapInTooltip,
} from '../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { getFormInitialValues, successMessageDelay } from '../../utils';
import { Prompt } from 'react-router-dom';
import { ShowLikeFlash } from '../shared/ShowLikeFlash/ShowLikeFlash';
import { Promotional } from '../shared/Promotional/Promotional';
import { CloudTagCompoundField } from '../form-helpers/CloudTagCompoundField';
import Modal from '../Modal/Modal';
import { SubscriberListSelector } from '../SubscriberListSelector/SubscriberListSelector';

const maxListsToSelect = 10;
const limitExceededMessageKey = 'contact_policy.tooltip_max_limit_exceeded';
const labelKey = 'name';
const fieldNames = {
  active: 'active',
  emailsAmountByInterval: 'emailsAmountByInterval',
  intervalInDays: 'intervalInDays',
  excludedSubscribersLists: 'excludedSubscribersLists',
};

export const ContactPolicy = InjectAppServices(
  ({
    dependencies: { dopplerUserApiClient, dopplerContactPolicyApiClient, appSessionRef },
    history,
  }) => {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLists, setSelectedLists] = useState([]);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const FieldItemMessage = ({ errors }) => {
      let message = {};
      if (errors.message) {
        message.text = errors.message;
        message.type = 'cancel';
      } else if (errors[fieldNames.excludedSubscribersLists]) {
        message.text = errors[fieldNames.excludedSubscribersLists];
        message.type = 'cancel';
      } else if (error) {
        message.text = 'common.unexpected_error';
        message.type = 'cancel';
      } else if (formSubmitted) {
        message.text = 'contact_policy.success_msg';
        message.type = 'success';
        message.delay = successMessageDelay;
      } else {
        return null;
      }

      return (
        <ShowLikeFlash delay={message.delay}>
          <li className="field-item">
            <IconMessage {...message} className="bounceIn" />
          </li>
        </ShowLikeFlash>
      );
    };

    useEffect(() => {
      const isContactPolicyEnabled = async () => {
        const { success, value } = await dopplerUserApiClient.getFeatures();
        return success && value.contactPolicies;
      };

      const fetchData = async () => {
        const isEnabled = await isContactPolicyEnabled();
        setEnabled(isEnabled);
        if (isEnabled) {
          const { success, value } = await dopplerContactPolicyApiClient.getAccountSettings();
          if (success) {
            setSettings(value);
            setError(false);
          } else {
            setSettings(undefined);
            setError(true);
          }
        }
        setLoading(false);
      };
      fetchData();
    }, [dopplerUserApiClient, dopplerContactPolicyApiClient, appSessionRef]);

    const submitContactPolicyForm = async (values, { setSubmitting, resetForm }) => {
      setFormSubmitted(false);
      try {
        const { success } = await dopplerContactPolicyApiClient.updateAccountSettings(values);
        if (success) {
          setFormSubmitted(true);
          resetForm({ values });
          setSettings(values);
          setError(false);
        } else {
          setError(true);
        }
      } finally {
        setSubmitting(false);
      }
    };

    const validate = (values) => {
      const errors = {};

      const amountIsEmpty = values.emailsAmountByInterval === '';
      const intervalIsEmpty = values.intervalInDays === '';

      if (amountIsEmpty || intervalIsEmpty) {
        errors.emailsAmountByInterval = amountIsEmpty;
        errors.intervalInDays = intervalIsEmpty;
        errors.message = 'validation_messages.error_required_field';
      } else {
        const amountOutOfRange =
          values.emailsAmountByInterval < 1 || values.emailsAmountByInterval > 999;
        const intervalOutOfRange = values.intervalInDays < 1 || values.intervalInDays > 30;

        if (amountOutOfRange || intervalOutOfRange) {
          errors.emailsAmountByInterval = amountOutOfRange;
          errors.intervalInDays = intervalOutOfRange;
          errors.message = (
            <FormattedMessageMarkdown id="contact_policy.error_invalid_range_msg_MD" />
          );
        }
      }

      return errors;
    };

    const hideMessage = () => {
      setError(false);
      setFormSubmitted(false);
    };

    const handleSelectLists = (list) => {
      setSelectedLists(list);
      hideMessage();
      setModalIsOpen(true);
    };

    if (loading) {
      return <Loading page />;
    }

    return enabled ? (
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
          <div className="dp-rowflex">
            <div className="col-lg-6 col-md-12 col-sm-12 m-b-24">
              <Formik
                onSubmit={submitContactPolicyForm}
                initialValues={{
                  ...getFormInitialValues(fieldNames),
                  ...settings,
                }}
                validate={validate}
                validateOnBlur={false}
                enableReinitialize={true}
              >
                {({ values, errors, isSubmitting, isValid, dirty }) => (
                  <>
                    <Prompt when={dirty} message={_('common.unsaved_changes_message')} />
                    <Form className="dp-contact-policy-form" aria-label="settings">
                      <fieldset>
                        <legend>{_('contact_policy.title')}</legend>
                        <FieldGroup>
                          <li className="field-item">
                            <SwitchField
                              id="contact-policy-switch"
                              name={fieldNames.active}
                              text={_('contact_policy.toggle_text')}
                              onToggle={() => hideMessage()}
                            />
                          </li>
                          <li className="field-item">
                            <div className="dp-item-block">
                              <div>
                                <span>{_('contact_policy.amount_description')}</span>
                                <NumberField
                                  className={errors.emailsAmountByInterval ? 'dp-error-input' : ''}
                                  name={fieldNames.emailsAmountByInterval}
                                  id="contact-policy-input-amount"
                                  disabled={!values[fieldNames.active]}
                                  required
                                  aria-label={_('common.emails')}
                                  onChangeValue={() => hideMessage()}
                                />
                                <span className="m-r-6">{_('common.emails')}</span>
                              </div>
                              <div>
                                <span>{_('contact_policy.interval_description')}</span>
                                <NumberField
                                  className={errors.intervalInDays ? 'dp-error-input' : ''}
                                  name={fieldNames.intervalInDays}
                                  id="contact-policy-input-interval"
                                  disabled={!values[fieldNames.active]}
                                  required
                                  aria-label={_('contact_policy.interval_unit')}
                                  onChangeValue={() => hideMessage()}
                                />
                                <span>{_('contact_policy.interval_unit')}</span>
                              </div>
                            </div>
                          </li>

                          <li className="field-item">
                            <p className="p-heading">
                              <strong>{_('contact_policy.exclude_list_title')}</strong>
                            </p>
                            <FormattedMessageMarkdown
                              id={'contact_policy.exclude_list_description_MD'}
                              className="m-t-12 m-b-12"
                            />
                          </li>
                          <li className="field-item">
                            <CloudTagCompoundField
                              fieldName={fieldNames.excludedSubscribersLists}
                              labelKey={labelKey}
                              max={maxListsToSelect}
                              disabled={!values[fieldNames.active]}
                              messageKeys={{
                                tagLimitExceeded: limitExceededMessageKey,
                              }}
                              render={() => {
                                const lists = values[fieldNames.excludedSubscribersLists];
                                const maxLimitReached = lists.length === maxListsToSelect;

                                return (
                                  <WrapInTooltip
                                    when={maxLimitReached}
                                    text={_(limitExceededMessageKey)}
                                  >
                                    <button
                                      type="button"
                                      className="dp-button dp-add-list"
                                      disabled={!values[fieldNames.active] || maxLimitReached}
                                      aria-label="add tag"
                                      onClick={() => handleSelectLists([...lists])}
                                    >
                                      <span>+</span>
                                      {_('contact_policy.select_lists')}
                                    </button>
                                  </WrapInTooltip>
                                );
                              }}
                            />
                          </li>

                          <FieldItemMessage errors={errors} />

                          <li className="field-item">
                            <hr />
                          </li>

                          <li className="field-item">
                            <button
                              type="button"
                              className="dp-button button-medium primary-grey"
                              onClick={() => history.goBack()}
                            >
                              {_('common.back')}
                            </button>
                            <span className="align-button m-l-24">
                              <button
                                type="submit"
                                disabled={
                                  !(isValid && dirty) || isSubmitting || (formSubmitted && !error)
                                }
                                className={
                                  'dp-button button-medium primary-green' +
                                  ((isSubmitting && ' button--loading') || '')
                                }
                              >
                                {_('common.save')}
                              </button>
                            </span>
                          </li>
                        </FieldGroup>
                      </fieldset>
                    </Form>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </section>
        <Modal isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)} type={'large'}>
          <SubscriberListSelector
            maxToSelect={maxListsToSelect}
            preselected={selectedLists}
            messageKeys={{
              title: 'contact_policy.exclude_list_selector.title',
              description: 'contact_policy.exclude_list_selector.description_MD',
              maxLimitExceeded: 'contact_policy.exclude_list_selector.max_limit_exceeded',
            }}
          />
        </Modal>
      </>
    ) : (
      <Promotional
        title={_('contact_policy.title')}
        description={<FormattedMessageMarkdown id={'contact_policy.promotional.description_MD'} />}
        features={[
          <FormattedMessageMarkdown id={'contact_policy.promotional.features.exclude_lists_MD'} />,
          <FormattedMessageMarkdown
            id={'contact_policy.promotional.features.exclude_campaigns_MD'}
          />,
        ]}
        paragraph={_('contact_policy.promotional.paragraph')}
        actionText={_('contact_policy.promotional.action_text').toUpperCase()}
        actionUrl={_('contact_policy.promotional.upgrade_plan_url')}
        //TODO: Replace icon and image urls
        logoUrl={'lists.svg'}
        previewUrl={'no-list.jpg'}
      />
    );
  },
);
