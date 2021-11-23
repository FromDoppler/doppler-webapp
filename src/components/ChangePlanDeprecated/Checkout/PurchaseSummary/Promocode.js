import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Formik, Field } from 'formik';
import { InjectAppServices } from '../../../../services/pure-di';
import { FieldGroup, FieldItem } from '../../../form-helpers/form-helpers';
import { getFormInitialValues } from '../../../../utils';
import { useQueryParams } from '../../../../hooks/useQueryParams';

const fieldNames = {
  promocode: 'promocode',
};

const validationsErrorKey = {
  requiredField: 'validation_messages.error_required_field',
  invalidPromocode: 'checkoutProcessForm.purchase_summary.promocode_error_message',
};

export const PromocodeFieldItem = ({
  className,
  fieldName,
  label,
  placeholder,
  validationError,
  validated,
  disabled,
  ...rest
}) => {
  return (
    <>
      <li className={`field-item ${className} ${validationError ? 'error' : ''}`}>
        <label htmlFor={fieldName}>{label}</label>
        <Field
          type="text"
          name={fieldName}
          id={fieldName}
          placeholder={placeholder}
          disabled={disabled || validated}
          {...rest}
        />
        {validationError ? (
          <div className="dp-message dp-error-form">
            <p>
              <FormattedMessage id={validationError} />
            </p>
          </div>
        ) : null}
      </li>
      <FieldItem className="field-item field-item--30">
        <div className="dp-buttons-actions">
          <button
            type="submit"
            className={'dp-button button-medium primary-green'}
            disabled={disabled || validated}
          >
            <FormattedMessage id="checkoutProcessForm.purchase_summary.promocode_validate_button" />
          </button>
        </div>
      </FieldItem>
    </>
  );
};

export const Promocode = InjectAppServices(
  ({
    allowPromocode,
    disabled,
    planId,
    callback,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);
    const query = useQueryParams();
    const selectedPromocode = query.get('promo-code') ?? query.get('PromoCode') ?? '';

    const apply = useCallback(
      async (promocode) => {
        setError('');
        if (!promocode) {
          setError(validationsErrorKey.requiredField);
        } else {
          const validateData = await dopplerAccountPlansApiClient.validatePromocode(
            planId,
            promocode,
          );

          if (!validateData.success) {
            setError(validationsErrorKey.invalidPromocode);
          } else {
            callback({ ...validateData.value, promocode });
          }

          setValidated(validateData.success);
        }
      },
      [planId, dopplerAccountPlansApiClient, setValidated, setError, callback],
    );

    useEffect(() => {
      const fetchData = async () => {
        if (selectedPromocode && allowPromocode) {
          apply(selectedPromocode);
        }
      };

      fetchData();
    }, [allowPromocode, selectedPromocode, apply]);

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);
      initialValues[fieldNames.promocode] = selectedPromocode;

      return initialValues;
    };

    const validatePromocode = async (value) => {
      apply(value.promocode);
    };

    return (
      <Formik onSubmit={validatePromocode} initialValues={_getFormInitialValues()}>
        {() => (
          <Form className="dp-promocode" aria-label="form">
            <legend>{_('checkoutProcessForm.purchase_summary.promocode_header')}</legend>
            <fieldset>
              <FieldGroup>
                <PromocodeFieldItem
                  aria-label={fieldNames.promocode}
                  disabled={!allowPromocode || disabled}
                  fieldName={fieldNames.promocode}
                  placeholder={_('checkoutProcessForm.purchase_summary.promocode_placeholder')}
                  label={`${_('checkoutProcessForm.purchase_summary.promocode_label')}`}
                  className={'field-item--70'}
                  validationError={error}
                  validated={validated}
                />
                {!allowPromocode ? (
                  <FieldItem className="field-item">
                    <div className="dp-wrap-message dp-wrap-info">
                      <span className="dp-message-icon"></span>
                      <div className="dp-content-message">
                        <p>{`${_('checkoutProcessForm.purchase_summary.promocode_tooltip')}`}</p>
                      </div>
                    </div>
                  </FieldItem>
                ) : validated ? (
                  <FieldItem className="field-item">
                    <div className="dp-wrap-message dp-wrap-success">
                      <span className="dp-message-icon"></span>
                      <div className="dp-content-message">
                        <p>
                          <FormattedMessage id="checkoutProcessForm.purchase_summary.promocode_success_message" />
                        </p>
                      </div>
                    </div>
                  </FieldItem>
                ) : null}
              </FieldGroup>
            </fieldset>
          </Form>
        )}
      </Formik>
    );
  },
);
