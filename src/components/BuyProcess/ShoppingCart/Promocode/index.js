import { Field, Form, Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../../services/pure-di';
import { getFormInitialValues, getPlanTypeFromUrlSegment } from '../../../../utils';
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
import { useParams } from 'react-router-dom';

const fieldNames = {
  promocode: 'promocode',
};

const validationsErrorKey = {
  requiredField: 'validation_messages.error_required_field',
  invalidPromocode: 'checkoutProcessForm.purchase_summary.promocode_error_message',
  expiredPromocode: 'checkoutProcessForm.purchase_summary.promocode_expired_error_message',
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
    isFreeAccount,
    disabledPromocode,
    handleRemovePromocodeApplied,
    currentPromocodeApplied,
    defaultPromocodeDismissed,
    handleManualPromocodeIntervention,
    registerClearPromocodeInput,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const query = useQueryParams();
    const defaultPromocode = getPromocode(query, isArgentina);
    const promocodeFromUrl =
      query.get('promo-code')?.trim() || query.get('PromoCode')?.trim() || '';
    const contactsPromocode = process.env.REACT_APP_PROMOCODE_CONTACTS?.trim() || '';
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const [open, setOpen] = useState(defaultPromocode !== '');
    const [currentPromotion, setCurrentPromotion] = useState(undefined);
    const [manualPromocodeApplied, setManualPromocodeApplied] = useState(false);

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
    const resetPromocodeState = useCallback(() => {
      promocodeMessageAlreadyShowRef.current = false;
      dispatch({
        type: PROMOCODE_ACTIONS.INITIALIZE_STATE,
      });
      setCurrentPromotion(undefined);
    }, []);
    const clearPromocodeInput = useCallback(() => {
      const { setFieldTouched, setFieldValue } = promocodeInputRef.current || {};

      if (setFieldValue) {
        setFieldValue(fieldNames.promocode, '', false);
      }

      if (setFieldTouched) {
        setFieldTouched(fieldNames.promocode, false, false);
      }

      resetPromocodeState();
      setManualPromocodeApplied(false);
      setOpen(true);
    }, [resetPromocodeState]);

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

              setCurrentPromotion({
                ...validatePromocodeData.value,
                planType: selectedMarketingPlan.type,
              });

              callback &&
                callback({
                  ...validatePromocodeData.value,
                  promocode: _promocode,
                  planType: selectedMarketingPlan.type,
                });
              createTimeout(() => {
                markPromocodeAsApplied();
              }, 2000);
            } else {
              callback && callback('');
              dispatch({
                type: PROMOCODE_ACTIONS.FETCH_FAILED,
                payload:
                  validatePromocodeData.error.response.status === 400 &&
                  validatePromocodeData.error.response.data.expiredPromocode
                    ? validationsErrorKey.expiredPromocode
                    : validationsErrorKey.invalidPromocode,
              });
            }
          };

          dispatch({ type: PROMOCODE_ACTIONS.FETCHING_STARTED });

          if (
            validatePercengePromocode &&
            promocodeFromUrl &&
            contactsPromocode &&
            isFreeAccount &&
            selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
            promocodeFromUrl !== contactsPromocode &&
            promocode === promocodeFromUrl
          ) {
            const { setFieldValue } = promocodeInputRef.current;
            const [validateData, validateContactsData] = await Promise.all([
              dopplerAccountPlansApiClient.validatePromocode(selectedMarketingPlan?.id, promocode),
              dopplerAccountPlansApiClient.validatePromocode(
                selectedMarketingPlan?.id,
                contactsPromocode,
              ),
            ]);
            if (validateData.success && !validateContactsData.success) {
              dispatchPromocode(validateData);
            } else if (validateContactsData.success && !validateData.success) {
              setFieldValue(fieldNames.promocode, contactsPromocode);
              dispatchPromocode(validateContactsData, contactsPromocode);
            } else if (
              (validateData?.value?.promotionApplied?.discountPercentage ?? -1) <
              (validateContactsData?.value?.promotionApplied?.discountPercentage ?? -1)
            ) {
              setFieldValue(fieldNames.promocode, contactsPromocode);
              dispatchPromocode(validateContactsData, contactsPromocode);
            } else {
              dispatchPromocode(validateData);
            }
          } else if (
            validatePercengePromocode &&
            isArgentina &&
            selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
            (selectedMarketingPlan?.subscriberLimit <=
              SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA ||
              selectedMarketingPlan?.subscribersQty <=
                SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA) &&
            promocode !== process.env.REACT_APP_PROMOCODE_ARGENTINA &&
            process.env.REACT_APP_PROMOCODE_ARGENTINA !== ''
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

            if (selectedPlanType === selectedMarketingPlan?.type) {
              const validateData = await dopplerAccountPlansApiClient.validatePromocode(
                selectedMarketingPlan?.id,
                promocode,
              );
              dispatchPromocode(validateData);
            }
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
        isFreeAccount,
        promocodeFromUrl,
        contactsPromocode,
        selectedPlanType,
      ],
    );

    useEffect(() => {
      setCurrentPromotion(currentPromocodeApplied?.promocode ? currentPromocodeApplied : undefined);
    }, [currentPromocodeApplied]);

    useEffect(() => {
      if (!registerClearPromocodeInput) {
        return undefined;
      }

      registerClearPromocodeInput(clearPromocodeInput);

      return () => {
        registerClearPromocodeInput(null);
      };
    }, [clearPromocodeInput, registerClearPromocodeInput]);

    useEffect(() => {
      // In this case the user selects a payment frequency or an email marketing plan
      const currentPromocode = promocodeInputRef.current?.values[fieldNames.promocode];
      const shouldValidatePromocode =
        (selectedPaymentFrequency === undefined ||
          selectedPaymentFrequency?.numberMonths === 1) &&
        currentPromocode;

      if (!alreadyInitializedRef.current) {
        resetPromocodeState();
      }

      if (shouldValidatePromocode) {
        validatePromocode(currentPromocode, !manualPromocodeApplied);
      }
    }, [
      selectedPaymentFrequency,
      selectedMarketingPlan,
      validatePromocode,
      manualPromocodeApplied,
      resetPromocodeState,
    ]);

    useEffect(() => {
      // In this case the user remove the promocode from shopping cart
      if (!hasPromocodeAppliedItem && promocodeApplied && !alreadyInitializedRef.current) {
        clearPromocodeInput();
      }
    }, [clearPromocodeInput, hasPromocodeAppliedItem, promocodeApplied]);

    useEffect(() => {
      // In this case there is a promocode by default (By URL)
      if (defaultPromocodeDismissed) {
        return;
      }

      if (defaultPromocode && allowPromocode && selectedMarketingPlan?.id) {
        const { setFieldValue } = promocodeInputRef.current;
        if (
          isArgentina &&
          defaultPromocode === process.env.REACT_APP_PROMOCODE_ARGENTINA &&
          process.env.REACT_APP_PROMOCODE_ARGENTINA !== '' &&
          selectedMarketingPlan?.type !== PLAN_TYPE.byContact
        ) {
          setFieldValue(fieldNames.promocode, '');
        } else {
          if (!disabledPromocode) {
            setOpen(true);
          }

          const promocodeToSet = currentPromocodeApplied?.promocode || defaultPromocode;

          setFieldValue(fieldNames.promocode, promocodeToSet);
          const validatePercengePromocode = true;
          validatePromocode(promocodeToSet, validatePercengePromocode);
        }
      }
    }, [
      validatePromocode,
      allowPromocode,
      defaultPromocode,
      selectedMarketingPlan,
      isArgentina,
      defaultPromocodeDismissed,
      disabledPromocode,
      hasPromocodeAppliedItem,
      currentPromocodeApplied?.promocode,
    ]);

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);
      initialValues[fieldNames.promocode] = defaultPromocodeDismissed ? '' : defaultPromocode || '';

      return initialValues;
    };

    const onSubmit = async (value) => {
      handleManualPromocodeIntervention && handleManualPromocodeIntervention();
      setManualPromocodeApplied(true);
      validatePromocode(value.promocode, false);
    };

    const promocodeIsDisabled =
      !allowPromocode || currentPromotion?.promotionApplied || loading || disabledPromocode;

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
                    validated={validated && promotion?.canApply}
                    promocodeApplied={promocodeApplied}
                    initialized={initialized}
                    selectedPaymentFrequency={selectedPaymentFrequency}
                    handleRemovePromocode={() => {
                      handleRemovePromocodeApplied();
                    }}
                  />
                </FieldGroup>
              </fieldset>
            </Form>
          )}
        </Formik>
        {/* {open && ( */}
        <PromocodeMessages
          allowPromocode={allowPromocode}
          validated={validated}
          promocodeApplied={promocodeApplied}
          promotion={currentPromotion}
          selectedMarketingPlan={selectedMarketingPlan}
          amountDetailsData={amountDetailsData}
          validationError={error}
          promocodeMessageAlreadyShowRef={promocodeMessageAlreadyShowRef}
        />
        {/* )} */}
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
  isFreeAccount: PropTypes.bool,
  defaultPromocodeDismissed: PropTypes.bool,
  handleManualPromocodeIntervention: PropTypes.func,
  registerClearPromocodeInput: PropTypes.func,
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
  handleRemovePromocode,
  ...rest
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { values } = useFormikContext();

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
            onClick={handleRemovePromocode}
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
  const promocodeFromUrl = query.get('promo-code')?.trim() || query.get('PromoCode')?.trim() || '';

  return !promocodeFromUrl && isArgentina
    ? process.env.REACT_APP_PROMOCODE_ARGENTINA
    : promocodeFromUrl;
};
