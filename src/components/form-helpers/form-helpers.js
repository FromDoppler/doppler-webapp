import React, { useState, useRef, useEffect } from 'react';
import { connect, Field, Formik, Form } from 'formik';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import {
  validateEmail,
  validateCheckRequired,
  validatePassword,
  validateRequiredField,
  combineValidations,
} from '../../validations';
import countriesEs from '../../i18n/countries-es.json';
import countriesEn from '../../i18n/countries-en.json';
import countriesLocalized from '../../i18n/countries-localized.json';
import intlTelInput from 'intl-tel-input';
// This import is required to add window.intlTelInputUtils, otherwise phone validation does not work
import 'intl-tel-input/build/js/utils';
import './form-helpers.css';
import 'intl-tel-input/build/css/intlTelInput.min.css';
import { useCaptcha } from './captcha-utils';

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

export const CaptchaLegalMessage = () => (
  <p className="captcha-legal-message">
    <FormattedHTMLMessage id="common.recaptcha_legal_HTML" />
  </p>
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
export const FormWithCaptcha = ({
  className,
  onSubmit,
  validate,
  initialValues,
  children,
  ...rest
}) => {
  /** Store original onSubmit because I need to replace it with verifyCaptchaAndSubmit */
  const originalOnSubmit = onSubmit;

  const [Captcha, verifyCaptcha] = useCaptcha();

  /** Try to verify captcha, if success run original onSubmit function */
  const verifyCaptchaAndSubmit = async (values, formikProps) => {
    // Disabled submitting state during captcha initialization to avoid dead-end
    // If challenge window is closed, we do not have feedback, so, by the moment,
    // we will keep the submit button disabled.
    // See more details in https://stackoverflow.com/questions/43488605/detect-when-challenge-window-is-closed-for-google-recaptcha
    formikProps.setSubmitting(false);
    const result = await verifyCaptcha();
    formikProps.setSubmitting(true);
    if (result.success) {
      await originalOnSubmit(
        { ...values, captchaResponseToken: result.captchaResponseToken },
        formikProps,
      );
    } else {
      console.log('Captcha error', result);
      formikProps.setErrors({ _general: 'validation_messages.error_unexpected' });
      formikProps.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={verifyCaptchaAndSubmit}
      validate={validate}
      {...rest}
      render={() => (
        <Form className={className}>
          <Captcha />
          {children}
        </Form>
      )}
    />
  );
};

export const FieldGroup = ({ className, children }) => (
  <ul className={concatClasses('field-group', className)}>{children}</ul>
);

export const FormErrors = connect(
  /**
   * @param { Object } props
   * @param { import('formik').FormikProps<Values> } props.formik
   */
  ({ formik: { errors } }) =>
    errors && errors['_general'] ? (
      <div className="form-message error">
        <div className="wrapper-errors">
          <ErrorMessage error={errors['_general']} />
        </div>
      </div>
    ) : null,
);

const ErrorMessage = injectIntl(({ intl, error }) =>
  React.isValidElement(error) ? (
    error
  ) : (
    // assuming string
    // TODO: also consider array of errors, and parameters for localization message placeholders
    <p className="error-message">{intl.formatMessage({ id: error })}</p>
  ),
);

export const FieldItem = connect(
  ({ className, fieldName, children, formik: { errors, touched } }) => (
    <li
      className={concatClasses(className, touched[fieldName] && errors[fieldName] ? 'error' : '')}
    >
      {children}
      {/* Boolean errors will not have message */}
      {touched[fieldName] && errors[fieldName] && errors[fieldName] !== true ? (
        <div className="wrapper-errors">
          <ErrorMessage error={errors[fieldName]} />
        </div>
      ) : null}
    </li>
  ),
);

const PasswordWrapper = connect(
  ({ className, fieldName, children, formik: { errors, touched } }) => {
    const fieldError = errors[fieldName];
    const touchedField = touched[fieldName];
    const passwordMessageCharClass = !touchedField
      ? 'waiting-message'
      : fieldError && (fieldError.charLength || fieldError.empty)
      ? 'lack-message'
      : 'complete-message';
    const passwordMessageDigitClass = !touchedField
      ? 'waiting-message'
      : fieldError && (fieldError.digit || fieldError.empty)
      ? 'lack-message'
      : 'complete-message';
    const passwordMessageLetterClass = !touchedField
      ? 'waiting-message'
      : fieldError && (fieldError.letter || fieldError.empty)
      ? 'lack-message'
      : 'complete-message';
    return (
      <li className={concatClasses(className, touchedField && fieldError ? 'error' : '')}>
        {children}
        <div className="wrapper-password">
          {!touchedField || fieldError ? (
            <p className="password-message">
              <span className={passwordMessageCharClass}>
                <FormattedMessage id="validation_messages.error_password_character_length" />
              </span>
              <span className={passwordMessageLetterClass}>
                <FormattedMessage id="validation_messages.error_password_letter" />
              </span>
              <span className={passwordMessageDigitClass}>
                <FormattedMessage id="validation_messages.error_password_digit" />
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
 */
const _PhoneFieldItem = ({
  intl,
  className,
  fieldName,
  label,
  placeholder,
  required,
  formik: { values, handleChange, handleBlur, setFieldValue },
  ...rest
}) => {
  const inputElRef = useRef(null);
  const intlTelInputRef = useRef(null);

  const formatFieldValueAsInternationalNumber = () => {
    const iti = intlTelInputRef.current;
    if (iti.isValidNumber()) {
      // It updates the value with international number
      // If we do not do it, we need to ensure to read intlTelInputRef value before submitting
      setFieldValue(fieldName, iti.getNumber(1));
    }
  };

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
      geoIpLookup: (callback) => {
        // TODO: determine current country using geolocation
        callback('ar');
      },
    });
    inputElRef.current.addEventListener('countrychange', handleChange);
    intlTelInputRef.current = iti;
    // It is to force international number on reload by language change, in another case
    // it uses national mode because of nationalMode
    formatFieldValueAsInternationalNumber();
    return () => {
      iti.destroy();
    };
  }, [intl.locale]);

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

export const PhoneFieldItem = injectIntl(connect(_PhoneFieldItem));

export const InputFieldItem = ({
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
      type={type}
      name={fieldName}
      id={fieldName}
      placeholder={placeholder}
      validate={createRequiredValidation(required)}
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

export const CheckboxFieldItem = ({ className, fieldName, label, checkRequired, ...rest }) => (
  <FieldItem
    className={concatClasses('field-item field-item__checkbox', className)}
    fieldName={fieldName}
  >
    <Field
      type="checkbox"
      name={fieldName}
      id={fieldName}
      validate={(value) => checkRequired && validateCheckRequired(value)}
      {...rest}
    />
    <span className="checkmark" />
    <label htmlFor={fieldName}> {label}</label>
  </FieldItem>
);

/**
 * Submit Button Component
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('formik').FormikProps<Values> } props.formik
 * @param { string } props.className
 */
const _SubmitButton = ({ children, formik: { isSubmitting } }) => {
  return (
    <>
      <button
        type="submit"
        disabled={isSubmitting}
        className={
          'dp-button button--round button-medium primary-green' +
          ((isSubmitting && ' button--loading') || '')
        }
      >
        {children}
      </button>
    </>
  );
};

export const SubmitButton = connect(_SubmitButton);
