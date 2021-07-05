import React, { useState, useRef, useEffect } from 'react';
import { connect, Field, Formik, Form } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  validateEmail,
  validateCheckRequired,
  validatePassword,
  validateRequiredField,
  validateName,
  combineValidations,
  validateMinLength,
} from '../../validations';
import countriesEs from '../../i18n/countries-es.json';
import countriesEn from '../../i18n/countries-en.json';
import countriesLocalized from '../../i18n/countries-localized.json';
import intlTelInput from 'intl-tel-input';
// This import is required to add window.intlTelInputUtils, otherwise phone validation does not work
import 'intl-tel-input/build/js/utils';
import './form-helpers.css';
import 'intl-tel-input/build/css/intlTelInput.min.css';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { addLogEntry } from '../../utils';
import useTimeout from '../../hooks/useTimeout';

function concatClasses(...args) {
  return args.filter((x) => x).join(' ');
}

function translateIntlTelInputCountryNames(language) {
  const countryData = window.intlTelInputGlobals.getCountryData();
  var countriesInCurrentLanguage = language === 'es' ? countriesEs : countriesEn;
  for (var i = 0; i < countryData.length; i++) {
    const country = countryData[i];
    const nameInCurrentLanguage = countriesInCurrentLanguage[country.iso2];
    if (nameInCurrentLanguage) {
      const nameLocalized = countriesLocalized[country.iso2];
      country.name =
        // Only add local name if it is not too long
        nameLocalized &&
        nameLocalized !== nameInCurrentLanguage &&
        nameInCurrentLanguage.length + nameLocalized.length < 50
          ? `${nameInCurrentLanguage} (${nameLocalized})`
          : nameInCurrentLanguage;
    }
  }
  countryData.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

/**
 * Creates a validation function based on required prop
 * @param { string | boolean } requiredProp
 */
function createRequiredValidation(requiredProp) {
  if (!requiredProp) {
    return () => null;
  }

  if (requiredProp === true) {
    return (value) => validateRequiredField(value);
  }

  return (value) => validateRequiredField(value, requiredProp);
}

function createMinLengthValidation(minLength) {
  return (value) => validateMinLength(value, minLength.min, minLength.errorMessageKey);
}

export const CaptchaLegalMessage = () => (
  <FormattedMessageMarkdown className={'captcha-legal-message'} id="common.recaptcha_legal_MD" />
);

/**
 * Form With Captcha Component
 * @param { Object } props
 * @param { string } props.className
 * @param { Function } props.onSubmit
 * @param { Function } props.validate
 * @param { Object } props.initialValues
 * @param { Object[] } props.children
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const _FormWithCaptcha = ({
  className,
  onSubmit,
  validate,
  initialValues,
  initialFormMessage,
  children,
  dependencies: { captchaUtilsService },
  ...rest
}) => {
  const createTimeout = useTimeout();

  /** Store original onSubmit because I need to replace it with verifyCaptchaAndSubmit */
  const originalOnSubmit = onSubmit;
  const [Captcha, verifyCaptcha] = captchaUtilsService.useCaptcha();

  /** Try to verify captcha, if success run original onSubmit function */
  const verifyCaptchaAndSubmit = async (values, formikProps) => {
    // Disabled submitting state during captcha initialization to avoid dead-end
    // If challenge window is closed, we do not have feedback, so, by the moment,
    // we will keep the submit button disabled.
    // See more details in https://stackoverflow.com/questions/43488605/detect-when-challenge-window-is-closed-for-google-recaptcha
    const captchaDelay = 100;
    createTimeout(() => formikProps.setSubmitting(false), captchaDelay);
    const result = await verifyCaptcha();
    createTimeout(() => formikProps.setSubmitting(true), captchaDelay);
    if (result.success) {
      await originalOnSubmit(
        { ...values, captchaResponseToken: result.captchaResponseToken },
        formikProps,
      );
    } else {
      console.log('Captcha error', result);
      addLogEntry({
        account: values.user,
        origin: window.location.origin,
        section: 'Form Verify Captcha',
        browser: window.navigator.userAgent,
        error: result,
      });
      formikProps.setErrors({
        _error: <FormattedMessageMarkdown id="validation_messages.error_unexpected_MD" />,
      });
      createTimeout(() => formikProps.setSubmitting(false), captchaDelay);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={verifyCaptchaAndSubmit}
      validate={validate}
      {...rest}
    >
      {() => (
        <Form className={className}>
          <Captcha />
          <SetFormMessage message={initialFormMessage} />
          {children}
        </Form>
      )}
    </Formik>
  );
};

export const FormWithCaptcha = InjectAppServices(_FormWithCaptcha);

export const FieldGroup = ({ className, children }) => (
  <ul className={concatClasses('field-group', className)}>{children}</ul>
);

const SetFormMessage = connect(({ formik: { setErrors }, message }) => {
  useEffect(() => {
    if (message) {
      setErrors(message);
    }
  }, [message, setErrors]);

  return null;
});

export const FormMessages = connect(
  /**
   * @param { Object } props
   * @param { import('formik').FormikProps<Values> } props.formik
   */
  ({ formik: { errors } }) => {
    const formMessages =
      errors && errors['_error']
        ? { message: errors['_error'], className: 'dp-error' }
        : errors && errors['_warning']
        ? { message: errors['_warning'], className: 'dp-warning-message' }
        : errors && errors['_success']
        ? { message: errors['_success'], className: 'dp-ok-message' }
        : null;
    return formMessages ? (
      <div className={`form-message bounceIn ${formMessages.className}`}>
        <div>
          <Message message={formMessages.message} />
        </div>
      </div>
    ) : null;
  },
);

const Message = ({ message }) => {
  const intl = useIntl();
  return React.isValidElement(message) ? (
    message
  ) : (
    // assuming string
    // TODO: also consider array of errors, and parameters for localization message placeholders
    <p>{intl.formatMessage({ id: message })}</p>
  );
};
export const FieldItem = connect(
  ({ className, fieldName, children, formik: { errors, touched, submitCount } }) => (
    <li
      className={concatClasses(
        className,
        submitCount && touched[fieldName] && errors[fieldName] ? 'error' : '',
      )}
    >
      {children}
      {/* Boolean errors will not have message */}
      {submitCount && touched[fieldName] && errors[fieldName] && errors[fieldName] !== true ? (
        <div className="dp-message dp-error-form">
          <Message message={errors[fieldName]} />
        </div>
      ) : null}
    </li>
  ),
);

const PasswordWrapper = connect(
  ({ className, fieldName, children, formik: { errors, touched } }) => {
    const fieldError = errors[fieldName];
    const touchedField = touched[fieldName];

    const passwordMessageCharClass =
      !touchedField && fieldError && fieldError.empty
        ? 'waiting-message'
        : fieldError && (fieldError.charLength || fieldError.empty)
        ? 'lack-message'
        : 'complete-message';
    const passwordMessageDigitClass =
      !touchedField && fieldError && fieldError.empty
        ? 'waiting-message'
        : fieldError && (fieldError.digit || fieldError.empty)
        ? 'lack-message'
        : 'complete-message';
    const passwordMessageLetterClass =
      !touchedField && fieldError && fieldError.empty
        ? 'waiting-message'
        : fieldError && (fieldError.letter || fieldError.empty)
        ? 'lack-message'
        : 'complete-message';
    return (
      <li className={concatClasses(className, touchedField && fieldError ? 'error' : '')}>
        {children}
        <div className="wrapper-password">
          {fieldError ? (
            <p className="password-message">
              <span className={passwordMessageCharClass}>
                <FormattedMessage id="validation_messages.error_password_character_length" />
              </span>
              <span className={passwordMessageDigitClass}>
                <FormattedMessage id="validation_messages.error_password_digit" />
              </span>
              <span className={passwordMessageLetterClass}>
                <FormattedMessage id="validation_messages.error_password_letter" />
              </span>
            </p>
          ) : (
            <p className="password-message">
              <span className="secure-message">
                <FormattedMessage id="validation_messages.error_password_safe" />
              </span>
            </p>
          )}
        </div>
      </li>
    );
  },
);

// This function is here, in global scope, to allow reusing without breaking dependencies of useEffect.
// See https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
const _formatFieldValueAsInternationalNumber = (iti, fieldName, setFieldValue) => {
  if (iti.isValidNumber()) {
    // It updates the value with international number
    // If we do not do it, we need to ensure to read intlTelInputRef value before submitting
    setFieldValue(fieldName, iti.getNumber(1));
  }
};

/**
 * Phone Field Item Component
 * @param { Object } props - props
 * @param { import('react-intl').InjectedIntl } props.intl - intl
 * @param { import('formik').FormikProps<Values> } props.formik - formik
 * @param { string } props.className - className
 * @param { string } props.fieldName - fieldName
 * @param { string } props.label - label
 * @param { string } props.placeholder - placeholder
 * @param { React.MutableRefObject<import('intl-tel-input').Plugin> } props.intlTelInputRef - intlTelInputRef
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const _PhoneFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  required,
  formik: { values, handleChange, handleBlur, setFieldValue },
  dependencies: { ipinfoClient },
  ...rest
}) => {
  const intl = useIntl();
  const inputElRef = useRef(null);
  const intlTelInputRef = useRef(null);
  const [eventListenerSet, setEventListenerSet] = useState(false);

  const formatFieldValueAsInternationalNumber = () =>
    _formatFieldValueAsInternationalNumber(intlTelInputRef.current, fieldName, setFieldValue);

  const validatePhone = (value) => {
    if (!value) {
      return null;
    }

    const iti = intlTelInputRef.current;
    if (iti && !iti.isValidNumber()) {
      const errorCode = iti.getValidationError();
      return errorCode === 1
        ? 'validation_messages.error_phone_invalid_country'
        : errorCode === 2
        ? 'validation_messages.error_phone_too_short'
        : errorCode === 3
        ? 'validation_messages.error_phone_too_long'
        : 'validation_messages.error_phone_invalid';
    }

    return null;
  };
  useEffect(() => {
    translateIntlTelInputCountryNames(intl.locale);
    const iti = intlTelInput(inputElRef.current, {
      // It is to accept national numbers, not only formating
      nationalMode: true,
      separateDialCode: false,
      autoPlaceholder: 'aggressive',
      preferredCountries: ['ar', 'mx', 'co', 'es', 'ec', 'cl', 'pe', 'us'],
      initialCountry: 'auto',
      geoIpLookup: async (success) => {
        const countryCode = await ipinfoClient.getCountryCode();
        success(countryCode);
      },
    });
    intlTelInputRef.current = iti;
    _formatFieldValueAsInternationalNumber(iti, fieldName, setFieldValue);
    return () => {
      setEventListenerSet(false);
      iti.destroy();
    };
  }, [intl.locale, fieldName, setFieldValue, ipinfoClient]);

  if (!eventListenerSet && inputElRef.current && intlTelInputRef.current) {
    inputElRef.current.addEventListener('countrychange', handleChange);
    setEventListenerSet(true);
  }

  return (
    <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
      <label htmlFor={fieldName}>{label}</label>
      <Field
        type="tel"
        innerRef={inputElRef}
        name={fieldName}
        id={fieldName}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={(e) => {
          formatFieldValueAsInternationalNumber();
          handleBlur(e);
        }}
        value={values[fieldName]}
        validate={combineValidations(createRequiredValidation(required), validatePhone)}
        {...rest}
      />
    </FieldItem>
  );
};

export const PhoneFieldItem = connect(InjectAppServices(_PhoneFieldItem));

export const InputFieldItem = ({
  className,
  fieldName,
  label,
  type,
  placeholder,
  required,
  withNameValidation,
  minLength,
  ...rest
}) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <label htmlFor={fieldName}>{label}</label>
    <Field
      type={type}
      name={fieldName}
      id={fieldName}
      placeholder={placeholder}
      validate={combineValidations(
        createRequiredValidation(required),
        minLength && createMinLengthValidation(minLength),
        withNameValidation && validateName,
      )}
      {...rest}
    />
  </FieldItem>
);

export const EmailFieldItem = ({
  className,
  fieldName,
  label,
  type,
  placeholder,
  required,
  ...rest
}) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <label htmlFor={fieldName}>{label}</label>
    <Field
      type="text"
      name={fieldName}
      id={fieldName}
      placeholder={placeholder}
      validate={combineValidations(createRequiredValidation(required), validateEmail)}
      {...rest}
    />
  </FieldItem>
);

const BasePasswordFieldItem = ({ fieldName, label, placeholder, required, ...rest }) => {
  const [passVisible, setPassVisible] = useState(false);
  const type = passVisible ? 'text' : 'password';
  const autocomplete = passVisible ? 'off' : 'current-password';
  const buttonClasses = passVisible ? 'show-hide icon-hide ms-icon' : 'show-hide ms-icon icon-view';
  const buttonTextId = passVisible ? 'common.hide' : 'common.show';

  return (
    <>
      <label htmlFor={fieldName}>
        {label}
        <button
          type="button"
          className={buttonClasses}
          onClick={() => {
            setPassVisible((current) => !current);
          }}
          // By the moment we will make it not accessible using keyboard
          // In the future, we could move after the password input as,
          // for example, Google does
          tabIndex="-1"
        >
          <span className="content-eye">
            {' '}
            <FormattedMessage id={buttonTextId} />
          </span>
        </button>
      </label>
      <Field
        type={type}
        name={fieldName}
        autoComplete={autocomplete}
        id={fieldName}
        placeholder={placeholder}
        spellCheck="false"
        badinput="false"
        autoCapitalize="off"
        validate={createRequiredValidation(required)}
        {...rest}
      />
    </>
  );
};

export const PasswordFieldItem = ({ className, fieldName, label, placeholder, ...rest }) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <BasePasswordFieldItem
      fieldName={fieldName}
      label={label}
      placeholder={placeholder}
      {...rest}
    />
  </FieldItem>
);

export const ValidatedPasswordFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  ...rest
}) => (
  <PasswordWrapper className={concatClasses('field-item', className)} fieldName={fieldName}>
    <BasePasswordFieldItem
      fieldName={fieldName}
      label={label}
      placeholder={placeholder}
      validate={validatePassword}
      {...rest}
    />
  </PasswordWrapper>
);

export const CheckboxFieldItem = ({
  className,
  fieldName,
  label,
  checkRequired,
  id,
  onChange,
  ...rest
}) => (
  <FieldItem
    className={concatClasses('field-item field-item__checkbox', className)}
    fieldName={fieldName}
  >
    <Field
      type="checkbox"
      name={fieldName}
      id={id || fieldName}
      validate={(value) => checkRequired && validateCheckRequired(value)}
      onClick={onChange}
      {...rest}
    />
    <span className="checkmark" />
    <label htmlFor={id || fieldName}> {label}</label>
  </FieldItem>
);

export const NumberField = ({ required, ...rest }) => (
  <Field type="number" validate={createRequiredValidation(required)} {...rest} />
);

export const SwitchField = ({ id, name, text, ...rest }) => (
  <>
    <div className="dp-switch">
      <Field type="checkbox" id={id || name} name={name} {...rest} />
      <label htmlFor={id || name}>
        <span />
      </label>
    </div>
    <label htmlFor={id || name}>{text}</label>
  </>
);

/**
 * Submit Button Component
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('formik').FormikProps<Values> } props.formik
 * @param { string } props.className
 */
const _SubmitButton = ({ children, formik: { isSubmitting }, className }) => {
  return (
    <>
      <button
        type="submit"
        disabled={isSubmitting}
        className={
          'dp-button button-medium primary-green' +
          ((isSubmitting && ' button--loading') || '') +
          ((className && ` ${className}`) || '')
        }
      >
        {children}
      </button>
    </>
  );
};

export const SubmitButton = connect(_SubmitButton);

export const SelectFieldItem = ({
  className,
  fieldName,
  label,
  type,
  placeholder,
  required,
  defaultOption,
  values,
  ...rest
}) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <label htmlFor={fieldName}>{label}</label>
    <span className="dropdown-arrow"></span>
    <Field
      as="select"
      name={fieldName}
      id={fieldName}
      placeholder={placeholder}
      validate={createRequiredValidation(required)}
      {...rest}
    >
      {defaultOption ? (
        <option key={defaultOption.key} value={defaultOption.key}>
          {defaultOption.value}
        </option>
      ) : null}
      {values.map((item) => (
        <option key={item.key} value={item.key}>
          {item.value}
        </option>
      ))}
    </Field>
  </FieldItem>
);
