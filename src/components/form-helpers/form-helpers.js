import React, { useState, useRef, useEffect } from 'react';
import { connect, Field } from 'formik';
import intlTelInput from 'intl-tel-input';
// This import is required to add window.intlTelInputUtils, otherwise phone validation does not work
import 'intl-tel-input/build/js/utils';
// TODO: it seems that these styles are making my input shorter, need to fix that.
import 'intl-tel-input/build/css/intlTelInput.min.css';

function concatClasses(...args) {
  return args.filter((x) => x).join(' ');
}

export const FieldGroup = ({ className, children }) => (
  <ul className={concatClasses('field-group', className)}>{children}</ul>
);

export const FieldItem = connect(
  ({ className, fieldName, children, formik: { errors, touched } }) => (
    <li
      className={concatClasses(className, touched[fieldName] && errors[fieldName] ? 'error' : '')}
    >
      {children}
      {touched[fieldName] && errors[fieldName] ? (
        <div className="wrapper-errors">
          <p className="error-message">{errors[fieldName]}</p>
        </div>
      ) : null}
    </li>
  ),
);

/**
 * Phone Field Item Component
 * @param { Object } props - props
 * @param { import('formik').FormikProps<Values> } props.formik - formik
 * @param { string } props.className - className
 * @param { string } props.fieldName - fieldName
 * @param { string } props.label - label
 * @param { string } props.placeholder - placeholder
 * @param { React.MutableRefObject<import('intl-tel-input').Plugin> } props.intlTelInputRef - intlTelInputRef
 */
const _PhoneFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  // It allows us to access IntlTelInput information during validation or submit
  // TODO: find a better way to share or inject this object.
  intlTelInputRef,
  formik: { values, handleChange, handleBlur, setFieldValue },
}) => {
  const inputElRef = useRef(null);
  intlTelInputRef = intlTelInputRef || useRef(null);

  const formatFieldValueAsInternationalNumber = () => {
    const iti = intlTelInputRef.current;
    if (iti.isValidNumber()) {
      // It updates the value with international number
      // If we do not do it, we need to ensure to read intlTelInputRef value before submitting
      setFieldValue(fieldName, iti.getNumber(1));
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
      <label htmlFor={fieldName}>{label}</label>
      <input
        type="tel"
        ref={inputElRef}
        name={fieldName}
        id={fieldName}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={(e) => {
          formatFieldValueAsInternationalNumber();
          handleBlur(e);
        }}
        value={values[fieldName]}
      />
    </FieldItem>
  );
};

export const PhoneFieldItem = connect(_PhoneFieldItem);

export const InputFieldItem = ({ className, fieldName, label, type, placeholder }) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <label htmlFor={fieldName}>{label}</label>
    <Field type={type} name={fieldName} id={fieldName} placeholder={placeholder} />
  </FieldItem>
);

export const PasswordFieldItem = ({ className, fieldName, label, placeholder, helpText }) => {
  const [passVisible, setPassVisible] = useState(false);
  const type = passVisible ? 'text' : 'password';
  const autocomplete = passVisible ? 'off' : 'current-password';
  const buttonClasses = passVisible ? 'show-hide icon-hide ms-icon' : 'show-hide ms-icon icon-view';

  return (
    <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
      <label htmlFor={fieldName}>
        {label}
        <button
          type="button"
          className={buttonClasses}
          onClick={() => {
            setPassVisible((current) => !current);
          }}
        >
          <span className="content-eye" />
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
      />
    </FieldItem>
  );
};

export const CheckboxFieldItem = ({ className, fieldName, label }) => (
  <FieldItem
    className={concatClasses('field-item field-item__checkbox', className)}
    fieldName={fieldName}
  >
    <Field type="checkbox" name={fieldName} id={fieldName} />
    <span className="checkmark" />
    <label htmlFor={fieldName}> {label}</label>
  </FieldItem>
);
