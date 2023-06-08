import React, { useState, useRef, useEffect } from 'react';
import { connect, Field, Formik, Form, useFormikContext } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  validateEmail,
  validateCheckRequired,
  validatePassword,
  validateRequiredField,
  validateName,
  combineValidations,
  validateMinLength,
  validatePDF,
} from '../../validations';
import countriesEs from '../../i18n/countries-es.json';
import countriesEn from '../../i18n/countries-en.json';
import countriesLocalized from '../../i18n/countries-localized.json';
import intlTelInput from 'intl-tel-input';
// This import is required to add window.intlTelInputUtils, otherwise phone validation does not work
import 'intl-tel-input/build/js/utils';
import './form-helpers.scss';
import 'intl-tel-input/build/css/intlTelInput.min.css';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { addLogEntry, concatClasses } from '../../utils';
import useTimeout from '../../hooks/useTimeout';
import { colors } from '../styles/colors';

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

const createPDFValidation = (maxSizeMB) => (file) => validatePDF(file, maxSizeMB);

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
        ? { message: errors['_error'], className: 'dp-wrap-message dp-wrap-cancel' }
        : errors && errors['_warning']
        ? { message: errors['_warning'], className: 'dp-warning-message' }
        : errors && errors['_success']
        ? { message: errors['_success'], className: 'dp-wrap-message dp-wrap-success' }
        : null;
    return formMessages ? (
      errors && errors['_warning'] ? (
        <div className={`form-message bounceIn ${formMessages.className}`}>
          <div>
            <Message message={formMessages.message} />
          </div>
        </div>
      ) : (
        <div className={`m-b-12 ${formMessages.className}`} role="alert" aria-label="cancel">
          <span className="dp-message-icon" />
          <div className="dp-content-message">
            <Message message={formMessages.message} />
          </div>
        </div>
      )
    ) : null;
  },
);

const Message = ({ message, values = null }) => {
  const intl = useIntl();
  return React.isValidElement(message) ? (
    message
  ) : (
    // assuming string
    // TODO: also consider array of errors, and parameters for localization message placeholders
    <p>{intl.formatMessage({ id: message }, values)}</p>
  );
};
export const FieldItem = connect(
  ({
    className,
    fieldName,
    children,
    formik: { errors, touched, submitCount },
    withErrors = true,
    // TODO: withSubmitCount and submitAccount should be removed when the change is made in all forms
    withSubmitCount = true,
  }) => (
    <li
      className={concatClasses(
        className,
        withErrors &&
          (withSubmitCount ? submitCount : true) &&
          touched[fieldName] &&
          errors[fieldName]
          ? 'error'
          : '',
      )}
    >
      {children}
      {/* Boolean errors will not have message */}
      {withErrors &&
      (withSubmitCount ? submitCount : true) &&
      touched[fieldName] &&
      errors[fieldName] &&
      errors[fieldName] !== true ? (
        <div className="dp-message dp-error-form">
          <Message message={errors[fieldName]} />
        </div>
      ) : null}
    </li>
  ),
);

export const FieldItemAccessible = ({ className, children }) => (
  <li className={`field-item awa-form ${className}`}>{children}</li>
);

const useFormikErrors = (fieldName, withSubmitCount, withErrors = true) => {
  const { errors, touched, submitCount } = useFormikContext();

  const showError =
    withErrors &&
    (withSubmitCount ? submitCount : true) &&
    touched[fieldName] &&
    errors[fieldName] &&
    errors[fieldName] !== true;

  return { showError, errors };
};

const MessageError = ({ showError, errors, fieldName, values = null }) => {
  if (!showError) {
    return null;
  }

  return (
    <div className="assistance-wrap">
      <Message message={errors[fieldName]} values={values} />
    </div>
  );
};

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
  withSubmitCount = true,
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
    <FieldItem
      className={concatClasses('field-item', className)}
      fieldName={fieldName}
      withSubmitCount={withSubmitCount}
    >
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
  withSubmitCount = true,
  minLength,
  ...rest
}) => (
  <FieldItem
    className={concatClasses('field-item', className)}
    fieldName={fieldName}
    withSubmitCount={withSubmitCount}
  >
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
  withSubmitCount = true,
  required,
  ...rest
}) => (
  <FieldItem
    className={concatClasses('field-item', className)}
    fieldName={fieldName}
    withSubmitCount={withSubmitCount}
  >
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

// TODO: once this field completely replaces the EmailFieldItem component,
// you should delete the old one and rename this new component to EmailFieldItem
export const EmailFieldItemAccessible = ({
  className,
  fieldName,
  label,
  type,
  placeholder,
  withSubmitCount = true,
  required,
  disabled = false,
  ...rest
}) => {
  const { showError, errors } = useFormikErrors(fieldName, withSubmitCount);
  return (
    <FieldItemAccessible className={className}>
      <label
        className="labelcontrol"
        htmlFor={fieldName}
        aria-disabled={disabled}
        data-required={!!required}
      >
        {label}
        <Field
          type="text"
          name={fieldName}
          id={fieldName}
          placeholder={placeholder}
          aria-invalid={showError}
          disabled={disabled}
          validate={combineValidations(createRequiredValidation(required), validateEmail)}
          {...rest}
        />
        <MessageError fieldName={fieldName} showError={showError} errors={errors} />
      </label>
    </FieldItemAccessible>
  );
};

const CustomInputFile = ({ fileProps }) => (
  <input
    type="file"
    accept={fileProps.accept}
    name={fileProps.name}
    id={fileProps.name}
    onChange={fileProps.onChange}
    onDrop={fileProps.onDrop}
    onDragOver={fileProps.onDragOver}
    onDragLeave={fileProps.onDragLeave}
    style={fileProps.active ? { background: colors.greenBackground } : null}
  />
);

const UploadedFile = ({ fileProps }) => (
  <div className="dp-inputfile-overlay">
    <span className="dp-namefile">{fileProps.currentFile.name}</span>
    <div className="dp-btns-overlay">
      <a
        className="dp-download-pdf"
        href={fileProps.currentFile.downloadURL}
        download={fileProps.currentFile.name}
        target="_blank"
      >
        download
      </a>
      <button className="dp-delete-pdf" type="button" onClick={fileProps.onRemove} />
    </div>
  </div>
);

// TODO: change this field to use given validations instead of just to be validating PDF
export const UploadFileFieldItem = ({
  className,
  fieldName,
  label,
  withSubmitCount = true,
  maxSizeMB = 25,
  required,
  disabled = false,
  accept,
  ...rest
}) => {
  const intl = useIntl();
  const { showError, errors } = useFormikErrors(fieldName, withSubmitCount);
  const { values, setFieldValue, setFieldError, submitCount } = useFormikContext();
  const [active, setActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [initialFile, setInitialFile] = useState(null);

  const fileObj = values[fieldName];
  const fieldNameError = errors[fieldName];

  useEffect(() => {
    if (fieldNameError && submitCount > 0) {
      setActive(false);
    }
  }, [fieldNameError, submitCount]);

  useEffect(() => {
    if (!file && !initialFile && fileObj) {
      setInitialFile(fileObj);
    }
  }, [file, fileObj, initialFile]);

  useEffect(() => {
    let fileReader;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result) {
          setFileDataURL(result);
        }
      };
      fileReader.onerror = (e) => {
        const { error } = e.target;
        setFieldError(fieldName, 'validation_messages.error_upload_file');
        console.log(error);
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      if (fileReader?.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file, setFieldError, fieldName]);

  const onRemove = (e) => {
    setFile('');
    setFieldValue(fieldName, '');
    setActive(false);
    setInitialFile(null);
    setFileDataURL(null);
  };

  const processFile = (file) => {
    setFile(file);
    setFieldValue(fieldName, file);
    setActive(true);
    setInitialFile(null);
  };

  const onChange = (e) => processFile(e.target.files[0]);

  const onDrop = (e) => processFile(e.dataTransfer.files[0]);

  const currentFile = file ? { name: file.name, downloadURL: fileDataURL } : initialFile;
  const showReadMode = initialFile && currentFile?.downloadURL === initialFile.downloadURL;
  const renderComponent = showReadMode
    ? UploadedFile // This is read mode
    : CustomInputFile; // This is write mode

  return (
    <li className={`field-item awa-form ${className}`}>
      <label
        className="dp-label-dropfile"
        htmlFor={fieldName}
        aria-disabled={disabled}
        aria-invalid={showError}
      >
        {label}
        <Field
          name={fieldName}
          id={fieldName}
          validate={combineValidations(
            createRequiredValidation(required),
            createPDFValidation(maxSizeMB),
          )}
          component={renderComponent}
          fileProps={
            showReadMode
              ? {
                  currentFile,
                  onRemove,
                }
              : {
                  accept,
                  active,
                  onChange,
                  onDrop,
                  onDragOver: () => setActive(true),
                  onDragLeave: () => setActive(false),
                }
          }
          {...rest}
        />
        {!showError && !showReadMode && (
          <div className="assistance-wrap">
            <span>
              {intl.formatMessage(
                { id: 'validation_messages.error_invalid_size_file' },
                { maxSizeMB },
              )}
            </span>
          </div>
        )}
        <MessageError
          fieldName={fieldName}
          showError={showError}
          errors={errors}
          values={{ maxSizeMB }}
        />
      </label>
    </li>
  );
};

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

// TODO: remove 'common.hide' and 'common.show' entries
const BasePasswordFieldItemAccessible = ({
  fieldName,
  label,
  placeholder,
  required,
  withSubmitCount = true,
  children,
  context = 'login',
  ...rest
}) => {
  const [passVisible, setPassVisible] = useState(false);
  const type = passVisible ? 'text' : 'password';
  const autocomplete = passVisible ? 'off' : 'current-password';
  const buttonClasses = passVisible ? 'show-hide icon-hide ms-icon' : 'show-hide ms-icon icon-view';
  const { showError } = useFormikErrors(fieldName, withSubmitCount);

  return (
    <label htmlFor={fieldName} className="labelpassword" data-required={required}>
      {label}
      <div className="dp-wrap-eyed">
        <button
          type="button"
          id="see"
          aria-label="see"
          className={buttonClasses}
          tabIndex="-1"
          onClick={() => setPassVisible((current) => !current)}
        />
        <Field
          type={type}
          name={fieldName}
          autoComplete={autocomplete}
          id={fieldName}
          placeholder={placeholder}
          aria-placeholder={placeholder}
          spellCheck="false"
          badinput="false"
          autoCapitalize="off"
          aria-required={!!required}
          aria-invalid={showError}
          validate={createRequiredValidation(required)}
          {...rest}
        />
        {context === 'login' && children}
      </div>
      {context === 'signup' && children}
    </label>
  );
};

export const PasswordFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  withSubmitCount = true,
  ...rest
}) => {
  const { showError, errors } = useFormikErrors(fieldName, withSubmitCount);

  return (
    <FieldItemAccessible className={className}>
      <BasePasswordFieldItemAccessible
        fieldName={fieldName}
        label={label}
        placeholder={placeholder}
        withSubmitCount={withSubmitCount}
        {...rest}
      >
        <MessageError fieldName={fieldName} showError={showError} errors={errors} />
      </BasePasswordFieldItemAccessible>
    </FieldItemAccessible>
  );
};

export const ValidatedPasswordFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  withSubmitCount = true,
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
  withErrors = true,
  withSubmitCount = true,
  ...rest
}) => (
  <FieldItem
    className={concatClasses('field-item field-item__checkbox', className)}
    fieldName={fieldName}
    withErrors={withErrors}
    withSubmitCount={withSubmitCount}
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

export const NumberField = connect(
  ({ required, onChangeValue, formik: { handleChange }, ...rest }) => (
    <Field
      type="number"
      validate={createRequiredValidation(required)}
      onChange={(e) => {
        onChangeValue(e);
        handleChange(e);
      }}
      {...rest}
    />
  ),
);

export const SwitchField = connect(
  ({ className, id, name, text, onToggle, formik: { handleChange }, ...rest }) => (
    <>
      <div className="dp-switch">
        <Field
          type="checkbox"
          id={id || name}
          name={name}
          onChange={(e) => {
            onToggle(e);
            handleChange(e);
          }}
          {...rest}
        />
        <label htmlFor={id || name}>
          <span />
        </label>
      </div>
      <label htmlFor={id || name}>{text}</label>
    </>
  ),
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

export const IconMessage = ({ text, type = 'info', className, fullContent = false }) => (
  <div className={concatClasses(`dp-wrap-message dp-wrap-${type}`, className)}>
    <span className="dp-message-icon" />
    <div className={'dp-content-message' + (fullContent ? '  dp-content-full' : '')}>
      <Message message={text} />
    </div>
  </div>
);

export const WrapInTooltip = ({ children, when = true, text }) => {
  return when ? (
    <div className="dp-tooltip-container">
      {children}
      <div className={`dp-tooltip-top`}>
        <span>{text}</span>
      </div>
    </div>
  ) : (
    children
  );
};

export const CuitFieldItem = ({
  type = 'text',
  className,
  fieldName,
  label,
  placeholder,
  required,
  validate,
  validateIdentificationNumber,
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
        validate && validateIdentificationNumber,
      )}
      {...rest}
    />
  </FieldItem>
);
