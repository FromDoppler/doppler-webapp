import { Field, Form, Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../../services/pure-di';
import { getFormInitialValues } from '../../../../utils';
import { FieldGroup, FieldItem } from '../../../form-helpers/form-helpers';
import {
  INITIAL_STATE_PROMOCODE,
  PROMOCODE_ACTIONS,
  promocodeReducer,
} from './reducers/promocodeReducer';
import useTimeout from '../../../../hooks/useTimeout';
import PropTypes from 'prop-types';
import { PromocodeMessages } from './PromocodeMessages';
import {
  PLAN_TYPE,
  SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA,
} from '../../../../doppler-types';

const fieldNames = {
  promocode: 'promocode',
};

const validationsErrorKey = {
  requiredField: 'validation_messages.error_required_field',
  invalidPromocode: 'checkoutProcessForm.purchase_summary.promocode_error_message',
};

export const Promocode = InjectAppServices(
  ({
    allowPromocode,
    selectedMarketingPlan,
    amountDetailsData,
    callback,
    selectedPaymentFrequency,
    hasPromocodeAppliedItem,
    isArgentina,
    disabledPromocode,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const query = useQueryParams();
    const defaultPromocode = getPromocode(query, isArgentina);

    const [open, setOpen] = useState(defaultPromocode !== '');
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const createTimeout = useTimeout();
    const [{ promotion, loading, validated, promocodeApplied, initialized, error }, dispatch] =
      useReducer(promocodeReducer, INITIAL_STATE_PROMOCODE);
    const promocodeMessageAlreadyShowRef = useRef(false);
    const openRef = useRef(null);
    const promotionRef = useRef(null);
    const promocodeInputRef = useRef(null);
    const alreadyInitializedRef = useRef(null);
    openRef.current = open;
    alreadyInitializedRef.current = initialized;
    promotionRef.current = promotion;

    const toggleOpen = useCallback(() => setOpen(!openRef.current), []);

    const markPromocodeAsApplied = useCallback(() => {
      dispatch({
        type: PROMOCODE_ACTIONS.PROMOCODE_APPLIED,
      });
      createTimeout(() => {
        promocodeMessageAlreadyShowRef.current = true;
        toggleOpen();
      }, 1000);
    }, [toggleOpen, createTimeout]);

    const validatePromocode = useCallback(
      async (promocode, validatePercengePromocode) => {
        promocodeMessageAlreadyShowRef.current = false;
        if (!promocode) {
          dispatch({
            type: PROMOCODE_ACTIONS.FETCH_FAILED,
            payload: validationsErrorKey.requiredField,
          });
        } else {
          const dispatchPromocode = (validatePromocodeData, _promocode = promocode) => {
            if (validatePromocodeData.success) {
              dispatch({
                type: PROMOCODE_ACTIONS.FINISH_FETCH,
                payload: {
                  ...validatePromocodeData.value,
                  promocode: _promocode,
                  planType: selectedMarketingPlan.type,
                },
              });
              callback &&
                callback({
                  ...validatePromocodeData.value,
                  promocode: _promocode,
                  planType: selectedMarketingPlan.type,
                });
              createTimeout(() => {
                markPromocodeAsApplied();
              }, 10000);
            } else {
              callback && callback('');
              dispatch({
                type: PROMOCODE_ACTIONS.FETCH_FAILED,
                payload: validationsErrorKey.invalidPromocode,
              });
            }
          };

          dispatch({ type: PROMOCODE_ACTIONS.FETCHING_STARTED });

          if (
            validatePercengePromocode &&
            isArgentina &&
            selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
            (selectedMarketingPlan?.subscriberLimit <=
              SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA ||
              selectedMarketingPlan?.subscribersQty <=
                SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA) &&
            promocode !== process.env.REACT_APP_PROMOCODE_ARGENTINA
          ) {
            const { setFieldValue } = promocodeInputRef.current;
            const [validateData, validateDefaultData] = await Promise.all([
              dopplerAccountPlansApiClient.validatePromocode(selectedMarketingPlan?.id, promocode),
              dopplerAccountPlansApiClient.validatePromocode(
                selectedMarketingPlan?.id,
                process.env.REACT_APP_PROMOCODE_ARGENTINA,
              ),
            ]);
            if (validateData.success && !validateDefaultData.success) {
              dispatchPromocode(validateData);
            } else if (validateDefaultData.success && !validateData.success) {
              setFieldValue(fieldNames.promocode, process.env.REACT_APP_PROMOCODE_ARGENTINA);
              dispatchPromocode(validateDefaultData, process.env.REACT_APP_PROMOCODE_ARGENTINA);
            } else if (
              validateData?.value?.discountPercentage <
              validateDefaultData?.value?.discountPercentage
            ) {
              setFieldValue(fieldNames.promocode, process.env.REACT_APP_PROMOCODE_ARGENTINA);
              dispatchPromocode(validateDefaultData, process.env.REACT_APP_PROMOCODE_ARGENTINA);
            } else {
              dispatchPromocode(validateData);
            }
          } else {
            const validateData = await dopplerAccountPlansApiClient.validatePromocode(
              selectedMarketingPlan?.id,
              promocode,
            );
            dispatchPromocode(validateData);
          }
        }
      },
      [
        dopplerAccountPlansApiClient,
        markPromocodeAsApplied,
        callback,
        createTimeout,
        selectedMarketingPlan,
        isArgentina,
      ],
    );

    useEffect(() => {
      // In this case the user selects a payment frequency or an email marketing plan
      if (!alreadyInitializedRef.current) {
        dispatch({
          type: PROMOCODE_ACTIONS.INITIALIZE_STATE,
        });
      } else {
        if (
          selectedPaymentFrequency?.numberMonths === 1 &&
          promocodeInputRef.current?.values[fieldNames.promocode]
        ) {
          validatePromocode(promocodeInputRef.current?.values[fieldNames.promocode], true);
        }
      }
    }, [selectedPaymentFrequency, selectedMarketingPlan, validatePromocode]);

    useEffect(() => {
      // In this case the user remove the promocode from shopping cart
      if (!hasPromocodeAppliedItem && promocodeApplied && !alreadyInitializedRef.current) {
        dispatch({
          type: PROMOCODE_ACTIONS.INITIALIZE_STATE,
        });
        const { setFieldValue } = promocodeInputRef.current;
        setFieldValue(fieldNames.promocode, '');
      }
    }, [hasPromocodeAppliedItem, promocodeApplied]);

    useEffect(() => {
      // In this case there is a promocode by default (By URL)
      if (defaultPromocode && allowPromocode && selectedMarketingPlan?.id) {
        const { setFieldValue } = promocodeInputRef.current;
        if (
          isArgentina &&
          defaultPromocode === process.env.REACT_APP_PROMOCODE_ARGENTINA &&
          selectedMarketingPlan?.type !== PLAN_TYPE.byContact
        ) {
          setFieldValue(fieldNames.promocode, '');
        } else {
          if (!disabledPromocode) {
            setOpen(true);
          }
          setFieldValue(fieldNames.promocode, defaultPromocode);
          const validatePercengePromocode = true;
          validatePromocode(defaultPromocode, validatePercengePromocode);
        }
      }
    }, [
      validatePromocode,
      allowPromocode,
      defaultPromocode,
      selectedMarketingPlan,
      isArgentina,
      disabledPromocode,
    ]);

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);
      initialValues[fieldNames.promocode] = defaultPromocode || '';

      return initialValues;
    };

    const onSubmit = async (value) => {
      validatePromocode(value.promocode);
    };

    const promocodeIsDisabled =
      !allowPromocode || promocodeApplied || loading || validated || disabledPromocode;

    return (
      <section className="dp-promocode">
        <button className="dp-show-promocode" onClick={toggleOpen}>
          <span className="dp-show-text">
            {open
              ? _('buy_process.promocode.dropdown_title_open')
              : _('buy_process.promocode.dropdown_title_close')}
          </span>
          <span className={`ms-icon icon-close ${!open ? 'rotation' : ''}`} title="Cerrar"></span>
        </button>
        <Formik
          onSubmit={onSubmit}
          initialValues={_getFormInitialValues()}
          innerRef={promocodeInputRef}
        >
          {() => (
            <Form
              className="awa-form dp-form-promocode"
              aria-label="form"
              style={{ display: open ? 'block' : 'none' }}
            >
              <legend>{_('checkoutProcessForm.purchase_summary.promocode_header')}</legend>
              <fieldset>
                <FieldGroup>
                  <PromocodeFieldItem
                    disabled={promocodeIsDisabled}
                    fieldName={fieldNames.promocode}
                    placeholder={_('checkoutProcessForm.purchase_summary.promocode_placeholder')}
                    label={`${_('checkoutProcessForm.purchase_summary.promocode_label')}`}
                    validationError={error}
                    validated={validated}
                    promocodeApplied={promocodeApplied}
                    initialized={initialized}
                    selectedPaymentFrequency={selectedPaymentFrequency}
                  />
                </FieldGroup>
              </fieldset>
            </Form>
          )}
        </Formik>
        {open && (
          <PromocodeMessages
            allowPromocode={allowPromocode}
            validated={validated}
            promocodeApplied={promocodeApplied}
            promotion={promotion}
            selectedMarketingPlan={selectedMarketingPlan}
            amountDetailsData={amountDetailsData}
            validationError={error}
            promocodeMessageAlreadyShowRef={promocodeMessageAlreadyShowRef}
          />
        )}
      </section>
    );
  },
);

Promocode.propTypes = {
  allowPromocode: PropTypes.bool,
  selectedMarketingPlan: PropTypes.object,
  amountDetailsData: PropTypes.object,
  callback: PropTypes.func,
  selectedPaymentFrequency: PropTypes.object,
  hasPromocodeAppliedItem: PropTypes.bool, // it allows to know if a promocode was applied or not in Shopping Cart
};

export const PromocodeFieldItem = ({
  fieldName,
  label,
  placeholder,
  validationError,
  disabled,
  validated,
  promocodeApplied,
  promocodeInputRef,
  initialized,
  selectedPaymentFrequency,
  ...rest
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <FieldItem className={`field-item field-item--70 ${validationError ? 'error' : ''}`}>
        <label htmlFor="promocode" className="labelcontrol" aria-disabled={disabled}>
          <Field
            type="text"
            id={fieldName}
            name={fieldName}
            placeholder="PROMO50%"
            aria-required={true}
            aria-invalid={!!validationError}
            disabled={disabled}
            className={validated ? 'dp-approved' : ''}
            {...rest}
          />
          <div className="assistance-wrap">
            <span>{validationError && <FormattedMessage id={validationError} />}</span>
          </div>
          <button
            type="button"
            className="dp-btn-delete dpicon iconapp-delete"
            title="borrar"
            disabled={!values[fieldName] || disabled}
            onClick={() => setFieldValue(fieldName, '')}
          />
        </label>
      </FieldItem>
      <FieldItem className="field-item field-item--30">
        <button type="submit" className="dp-button button-medium ctaTertiary" disabled={disabled}>
          {_('buy_process.promocode.apply_btn')}
        </button>
      </FieldItem>
    </>
  );
};

export const getPromocode = (query, isArgentina) => {
  const promocodeFromUrl = query.get('promo-code') ?? query.get('PromoCode') ?? '';

  return !promocodeFromUrl && isArgentina
    ? process.env.REACT_APP_PROMOCODE_ARGENTINA
    : promocodeFromUrl;
};
