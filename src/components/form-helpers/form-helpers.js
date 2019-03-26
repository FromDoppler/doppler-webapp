import React from 'react';
import { connect, Field } from 'formik';

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

export const InputFieldItem = ({ className, fieldName, label, type, placeholder }) => (
  <FieldItem className={concatClasses('field-item', className)} fieldName={fieldName}>
    <label htmlFor={fieldName}>{label}</label>
    <Field type={type} name={fieldName} id={fieldName} placeholder={placeholder} />
  </FieldItem>
);

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
