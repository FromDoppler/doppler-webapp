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
import { ShowLikeFlash } from '../shared/ShowLikeFlash/ShowLikeFlash';
import { Promotional } from '../shared/Promotional/Promotional';
import { CloudTagCompoundField } from '../form-helpers/CloudTagCompoundField';
import Modal from '../Modal/Modal';
import { SubscriberListSelector } from '../SubscriberListSelector/SubscriberListSelector';
import contactPolicyPreview from './contact-policy-preview.gif';
import { useNavigate } from 'react-router-dom';

const maxListsToSelect = 10;
const limitExceededMessageKey = 'contact_policy.tooltip_max_limit_exceeded';
const labelKey = 'name';
const fieldNames = {
  active: 'active',
  emailsAmountByInterval: 'emailsAmountByInterval',
  intervalInDays: 'intervalInDays',
  excludedSubscribersLists: 'excludedSubscribersLists',
  timeRestrictionHourFrom: 'timeRestriction.hourFrom',
  timeRestrictionHourTo: 'timeRestriction.hourTo',
  timeRestrictionTimeSlotEnabled: 'timeRestriction.timeSlotEnabled',
  timeRestrictionWeekdaysEnabled: 'timeRestriction.weekdaysEnabled',
};

export const ContactPolicy = InjectAppServices(
  ({
    dependencies: {
      dopplerUserApiClient,
      dopplerContactPolicyApiClient,
      experimentalFeatures,
      appSessionRef,
    },
  }) => {
    const navigate = useNavigate();
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalClassName, setModalClassName] = useState('dp-modal-exclude-list');
    const [selectedLists, setSelectedLists] = useState([]);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const FieldItemMessage = ({ errors }) => {
      let message = {};
      if (errors[fieldNames.excludedSubscribersLists]) {
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
    }, [dopplerUserApiClient, dopplerContactPolicyApiClient, experimentalFeatures, appSessionRef]);

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

    const validateShipmentsQuantitySwitch = (values) => {
      const errors = {};

      const amountIsEmpty = values.emailsAmountByInterval === '';
      const intervalIsEmpty = values.intervalInDays === '';

      if (amountIsEmpty || intervalIsEmpty) {
        errors.emailsAmountByInterval = amountIsEmpty;
        errors.intervalInDays = intervalIsEmpty;
        errors.messageForShipmentsQuantity = (
          <FormattedMessageMarkdown id="validation_messages.error_required_field" />
        );
      } else {
        const amountOutOfRange =
          values.emailsAmountByInterval < 1 || values.emailsAmountByInterval > 999;
        const intervalOutOfRange = values.intervalInDays < 1 || values.intervalInDays > 30;

        if (amountOutOfRange || intervalOutOfRange) {
          errors.emailsAmountByInterval = amountOutOfRange;
          errors.intervalInDays = intervalOutOfRange;
          errors.messageForShipmentsQuantity = (
            <FormattedMessageMarkdown id="contact_policy.error_invalid_range_msg_MD" />
          );
        }
      }

      return errors;
    };

    const validateTimeSlotSwitch = (values) => {
      const errors = {};

      const hourFromEmpty = values.timeRestriction.hourFrom === '';
      const hourToEmpty = values.timeRestriction.hourTo === '';

      if (hourFromEmpty || hourToEmpty) { // hours are empty
        errors.timeRestrictionHourFrom = hourFromEmpty;
        errors.timeRestrictionHourTo = hourToEmpty;
        errors.messageForTimeSlot = (
          <FormattedMessageMarkdown id="validation_messages.error_required_field" />
        );
      } else { // hours are not empty
        const hourFromOutOfRange =
          values.timeRestriction.hourFrom < 0 || values.timeRestriction.hourFrom > 23;
        const hourToOutOfRange =
          values.timeRestriction.hourTo < 0 || values.timeRestriction.hourTo > 23;

        if (hourFromOutOfRange || hourToOutOfRange) {
          errors.timeRestrictionHourFrom = hourFromOutOfRange;
          errors.timeRestrictionHourTo = hourToOutOfRange;
          errors.messageForTimeSlot = (
            <FormattedMessageMarkdown id="contact_policy.time_restriction.error_invalid_range_of_hours_msg" />
          );
        } else if (values.timeRestriction.hourFrom === values.timeRestriction.hourTo) { // hours are equal
          errors.timeRestrictionHourFrom = true;
          errors.timeRestrictionHourTo = true;
          errors.messageForTimeSlot = (
            <FormattedMessageMarkdown id="contact_policy.time_restriction.error_equal_hours_msg" />
          );
        }
      }

      return errors;
    };

    const validate = (values) => {
      const errorsShipmentsQuantitySwitch = validateShipmentsQuantitySwitch(values);
      const errorsTimeSlotSwitch = validateTimeSlotSwitch(values);

      return { ...errorsShipmentsQuantitySwitch, ...errorsTimeSlotSwitch };
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

    const handleOnConfirmSelectedLists = (lists, setFieldValue) => {
      setModalIsOpen(false);
      setFieldValue(fieldNames.excludedSubscribersLists, lists);
    };

    if (loading) {
      return <Loading page />;
    }

    if (!enabled) {
      return (
        <Promotional
          title={_('contact_policy.title')}
          description={
            <FormattedMessageMarkdown id={'contact_policy.promotional.description_MD'} />
          }
          features={[
            <FormattedMessageMarkdown
              id={'contact_policy.promotional.features.exclude_lists_MD'}
            />,
            <FormattedMessageMarkdown
              id={'contact_policy.promotional.features.exclude_campaigns_MD'}
            />,
          ]}
          paragraph={_('contact_policy.promotional.paragraph')}
          actionText={_('contact_policy.promotional.action_text').toUpperCase()}
          actionUrl={_('contact_policy.promotional.upgrade_plan_url')}
          logoUrl={_('common.ui_library_image', { imageUrl: 'icon-pcontacto.svg' })}
          //TODO: Replace icon and image urls
          previewUrl={contactPolicyPreview}
        />
      );
    }

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
            <h1>{_('contact_policy.title')}</h1>
          </div>
        </HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-lg-8 col-md-12 col-sm-12 m-b-24">
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
                {({ values, errors, isSubmitting, isValid, dirty, setFieldValue }) => (
                  <>
                    {/* TODO: this is not currently supported in the current released version of v6 (https://reactrouter.com/docs/en/v6/upgrading/v5#prompt-is-not-currently-supported) */}
                    {/* <Prompt
                      when={dirty && !modalIsOpen}
                      message={_('common.unsaved_changes_message')}
                    /> */}
                    <Form className="dp-contact-policy-form" aria-label="settings">
                      <fieldset>
                        <legend>{_('contact_policy.title')}</legend>
                        <FieldGroup>
                          <h2>{_('contact_policy.shipments_quantity.title')}</h2>
                          <li className="field-item">
                            <FormattedMessageMarkdown
                              linkTarget={'_blank'}
                              id="contact_policy.shipments_quantity.subtitle_MD"
                            />
                          </li>
                          <li className="field-item">
                            <SwitchField
                              id="contact-policy-switch"
                              name={fieldNames.active}
                              text={_('contact_policy.toggle_text')}
                              onToggle={() => hideMessage()}
                            />
                          </li>
                          <li className="field-item">
                            <div className="dp-item-block awa-form">
                              <label
                                className="labelcontrol"
                                data-required="false"
                                aria-disabled={!values[fieldNames.active]}
                              >
                                <span>{_('contact_policy.amount_description')}</span>
                                <NumberField
                                  aria-invalid={errors.emailsAmountByInterval ? 'true' : 'false'}
                                  name={fieldNames.emailsAmountByInterval}
                                  id="contact-policy-input-amount"
                                  disabled={!values[fieldNames.active]}
                                  required
                                  aria-label={_('common.emails')}
                                  onChangeValue={() => hideMessage()}
                                />
                                <span className="m-r-6">{_('common.emails')}</span>

                                <span>{_('contact_policy.interval_description')}</span>
                                <NumberField
                                  aria-invalid={errors.intervalInDays ? 'true' : 'false'}
                                  name={fieldNames.intervalInDays}
                                  id="contact-policy-input-interval"
                                  disabled={!values[fieldNames.active]}
                                  required
                                  aria-label={_('contact_policy.interval_unit')}
                                  onChangeValue={() => hideMessage()}
                                />
                                <span>{_('contact_policy.interval_unit')}</span>

                                <div
                                  className={`dp-textmessage ${
                                    errors.emailsAmountByInterval || errors.intervalInDays
                                      ? 'show'
                                      : ''
                                  }`}
                                >
                                  {errors.messageForShipmentsQuantity}
                                </div>
                              </label>
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
                              disabled={!values[fieldNames.active] || isSubmitting}
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

                          <div>
                            <li className="field-item">
                              <hr />
                            </li>

                            <h2>{_('contact_policy.time_restriction.title')}</h2>

                            <li className="field-item">
                              <FormattedMessageMarkdown
                                linkTarget={'_blank'}
                                id="contact_policy.time_restriction.legend"
                              />
                            </li>

                            <li className="field-item">
                              <SwitchField
                                id="contact-policy-time-slot-switch"
                                name={fieldNames.timeRestrictionTimeSlotEnabled}
                                text={_('contact_policy.time_restriction.time_slot_toggle_text')}
                                onToggle={() => hideMessage()}
                              />

                              <p
                                className="dp-color-gray dp-text--italic m-t-6"
                              >
                                <strong className="dp-color-red">
                                  {_('contact_policy.time_restriction.time_slot_hint_title')}
                                </strong>{' '}
                                {_('contact_policy.time_restriction.time_slot_hint_text')}
                              </p>
                            </li>
                            <li className="field-item">
                              <div className="dp-item-block awa-form">
                                <label
                                  className="labelcontrol"
                                  data-required="false"
                                  aria-disabled={!values['timeRestriction']['timeSlotEnabled']}
                                >
                                  <span>
                                    {_('contact_policy.time_restriction.time_slot_hour_from_label')}
                                  </span>
                                  <NumberField
                                    aria-invalid={errors.timeRestrictionHourFrom ? 'true' : 'false'}
                                    name={fieldNames.timeRestrictionHourFrom}
                                    id="time-restriction-time-slot-from"
                                    disabled={!values['timeRestriction']['timeSlotEnabled']}
                                    required
                                    aria-label={_(
                                      'contact_policy.time_restriction.hour_from_aria_label',
                                    )}
                                    onChangeValue={() => hideMessage()}
                                  />
                                  <span className="m-r-30">{_('common.hours_abbreviation')}</span>

                                  <span>
                                    {_('contact_policy.time_restriction.time_slot_hour_to_label')}
                                  </span>
                                  <NumberField
                                    aria-invalid={errors.timeRestrictionHourTo ? 'true' : 'false'}
                                    name={fieldNames.timeRestrictionHourTo}
                                    id="time-restriction-time-slot-to"
                                    disabled={!values['timeRestriction']['timeSlotEnabled']}
                                    required
                                    aria-label={_(
                                      'contact_policy.time_restriction.hour_to_aria_label',
                                    )}
                                    onChangeValue={() => hideMessage()}
                                  />
                                  <span>{_('common.hours_abbreviation')}</span>

                                  <div
                                    className={`dp-textmessage ${
                                      errors.timeRestrictionHourFrom || errors.timeRestrictionHourTo
                                        ? 'show'
                                        : ''
                                    }`}
                                  >
                                    {errors.messageForTimeSlot}
                                  </div>
                                </label>
                              </div>
                            </li>

                            <li className="field-item">
                              <SwitchField
                                id="contact-policy-weekdays-switch"
                                name={fieldNames.timeRestrictionWeekdaysEnabled}
                                text={_('contact_policy.time_restriction.weekdays_toggle_text')}
                                onToggle={() => hideMessage()}
                              />
                            </li>
                          </div>

                          <FieldItemMessage errors={errors} />

                          <li className="field-item">
                            <hr />
                          </li>

                          <li className="field-item">
                            <button
                              type="button"
                              className="dp-button button-medium primary-grey"
                              onClick={() => navigate(-1)}
                            >
                              {_('common.back')}
                            </button>
                            <span className="align-button m-l-24">
                              <button
                                type="submit"
                                disabled={!isValid || !dirty || isSubmitting}
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
                    <Modal
                      isOpen={modalIsOpen}
                      handleClose={() => setModalIsOpen(false)}
                      type={'large'}
                      className={modalClassName}
                    >
                      <SubscriberListSelector
                        maxToSelect={maxListsToSelect}
                        preselected={selectedLists}
                        messageKeys={{
                          title: 'contact_policy.exclude_list_selector.title',
                          description: 'contact_policy.exclude_list_selector.description_MD',
                          maxLimitExceeded:
                            'contact_policy.exclude_list_selector.max_limit_exceeded',
                        }}
                        onCancel={() => setModalIsOpen(false)}
                        onConfirm={(lists) => handleOnConfirmSelectedLists(lists, setFieldValue)}
                        onNoList={() => setModalClassName('dp-modal-nolist')}
                        onError={() => setModalClassName('dp-error-list')}
                      />
                    </Modal>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </section>
      </>
    );
  },
);
