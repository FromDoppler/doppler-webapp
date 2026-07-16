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
  expiredPromocode: 'checkoutProcessForm.purchase_summary.promocode_expired_error_message',
};

const getPromocodeFromQuery = (query) =>
  query.get('promo-code')?.trim() ||
  query.get('Promo-code')?.trim() ||
  query.get('PromoCode')?.trim() ||
  '';

const getPromotionDiscountPercentage = (validatePromocodeData) =>
  validatePromocodeData?.value?.promotionApplied?.discountPercentage ??
  validatePromocodeData?.value?.discountPercentage ??
  -1;

const getNormalizedQuantities = (quantity) =>
  String(quantity ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const getNormalizedPromotionModule = (planType) => {
  const normalizedPlanType = String(planType ?? '')
    .trim()
    .toLowerCase();

  if (
    normalizedPlanType === '4' ||
    normalizedPlanType === PLAN_TYPE.byContact ||
    normalizedPlanType === 'contact' ||
    normalizedPlanType === 'contacts' ||
    normalizedPlanType === 'subscriber' ||
    normalizedPlanType === 'subscribers'
  ) {
    return PLAN_TYPE.byContact;
  }

  if (
    normalizedPlanType === '3' ||
    normalizedPlanType === PLAN_TYPE.byCredit ||
    normalizedPlanType === 'credit' ||
    normalizedPlanType === 'credits' ||
    normalizedPlanType === 'prepaid'
  ) {
    return PLAN_TYPE.byCredit;
  }

  if (
    normalizedPlanType === '2' ||
    normalizedPlanType === PLAN_TYPE.byEmail ||
    normalizedPlanType === 'email' ||
    normalizedPlanType === 'emails' ||
    normalizedPlanType === 'monthly-deliveries'
  ) {
    return PLAN_TYPE.byEmail;
  }

  return null;
};

const canPromotionApplyToAnyPlanInModule = (
  planPromotions,
  availablePlanQuantities,
  modulePlanType,
) =>
  (planPromotions ?? []).some((planPromotion) => {
    const normalizedQuantities = getNormalizedQuantities(planPromotion?.quantity);

    if (normalizedQuantities.length > 0) {
      return normalizedQuantities.some((quantity) => availablePlanQuantities.includes(quantity));
    }

    return getNormalizedPromotionModule(planPromotion?.planType) === modulePlanType;
  });

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
    defaultPromocode,
    allowDefaultPromocodeFromQuery,
    availablePlanQuantities = [],
    modulePlanType,
    disabledPromocode,
    handleRemovePromocodeApplied,
    currentPromocodeApplied,
    defaultPromocodeDismissed,
    handleManualPromocodeIntervention,
    registerClearPromocodeInput,
    hideCanNotApplyMessage,
    dependencies: { dopplerAccountPlansApiClient },
  }) => {
    const query = useQueryParams();
    const promocodeFromUrl = getPromocodeFromQuery(query);
    const defaultPromocodeValue = allowDefaultPromocodeFromQuery
      ? promocodeFromUrl || defaultPromocode || getPromocode(query, isArgentina, isFreeAccount)
      : defaultPromocode || '';
    const [currentPromotion, setCurrentPromotion] = useState(undefined);
    const [manualPromocodeApplied, setManualPromocodeApplied] = useState(false);

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const createTimeout = useTimeout();
    const [{ promotion, loading, validated, promocodeApplied, initialized, error }, dispatch] =
      useReducer(promocodeReducer, INITIAL_STATE_PROMOCODE);
    const promocodeMessageAlreadyShowRef = useRef(false);
    const promocodeInputRef = useRef(null);
    const alreadyInitializedRef = useRef(null);
    const autoInitializationSuppressedRef = useRef(false);
    const suppressValidationUntilPromocodeClearedRef = useRef(false);
    const autoInitializedValidationKeyRef = useRef('');
    const planValidationKeyRef = useRef('');
    const validationRequestIdRef = useRef(0);
    const cancelledValidationRequestIdRef = useRef(0);
    alreadyInitializedRef.current = initialized;

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
      autoInitializationSuppressedRef.current = true;
      suppressValidationUntilPromocodeClearedRef.current = true;
      autoInitializedValidationKeyRef.current = '__dismissed__';
      planValidationKeyRef.current = '';
      // Ignore async validate responses started before manual remove.
      cancelledValidationRequestIdRef.current = validationRequestIdRef.current;
    }, [resetPromocodeState]);

    const markPromocodeAsApplied = useCallback(() => {
      dispatch({
        type: PROMOCODE_ACTIONS.PROMOCODE_APPLIED,
      });
      createTimeout(() => {
        promocodeMessageAlreadyShowRef.current = true;
      }, 1000);
    }, [createTimeout]);

    const validatePromocode = useCallback(
      async (
        promocode,
        validatePercengePromocode,
        { silentlyClearOnInvalid = false, setInputOnSuccess = false } = {},
      ) => {
        const requestId = validationRequestIdRef.current + 1;
        validationRequestIdRef.current = requestId;

        promocodeMessageAlreadyShowRef.current = false;
        if (!promocode) {
          dispatch({
            type: PROMOCODE_ACTIONS.FETCH_FAILED,
            payload: validationsErrorKey.requiredField,
          });
        } else {
          const dispatchPromocode = (validatePromocodeData, _promocode = promocode) => {
            if (requestId <= cancelledValidationRequestIdRef.current) {
              return;
            }

            const canApplyPromotion = validatePromocodeData?.value?.canApply !== false;
            const canApplyToAnyPlanInModule = canPromotionApplyToAnyPlanInModule(
              validatePromocodeData?.value?.planPromotions,
              availablePlanQuantities,
              modulePlanType,
            );

            if (validatePromocodeData.success && canApplyPromotion) {
              if (setInputOnSuccess) {
                const { setFieldValue } = promocodeInputRef.current || {};

                if (setFieldValue) {
                  setFieldValue(fieldNames.promocode, _promocode, false);
                }
              }

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
            } else if (validatePromocodeData.success) {
              if (silentlyClearOnInvalid && !canApplyToAnyPlanInModule) {
                const { setFieldTouched, setFieldValue } = promocodeInputRef.current || {};

                if (setFieldValue) {
                  setFieldValue(fieldNames.promocode, '', false);
                }

                if (setFieldTouched) {
                  setFieldTouched(fieldNames.promocode, false, false);
                }

                resetPromocodeState();
                return;
              }

              if (setInputOnSuccess) {
                const { setFieldValue } = promocodeInputRef.current || {};

                if (setFieldValue) {
                  setFieldValue(fieldNames.promocode, _promocode, false);
                }
              }

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
                promocode: _promocode,
                planType: selectedMarketingPlan.type,
              });

              callback &&
                callback({
                  ...validatePromocodeData.value,
                  promocode: _promocode,
                  planType: selectedMarketingPlan.type,
                });
            } else {
              callback && callback('');

              if (silentlyClearOnInvalid) {
                const { setFieldTouched, setFieldValue } = promocodeInputRef.current || {};

                if (setFieldValue) {
                  setFieldValue(fieldNames.promocode, '', false);
                }

                if (setFieldTouched) {
                  setFieldTouched(fieldNames.promocode, false, false);
                }

                resetPromocodeState();
                return;
              }

              dispatch({
                type: PROMOCODE_ACTIONS.FETCH_FAILED,
                payload:
                  validatePromocodeData?.error?.response?.status === 400 &&
                  validatePromocodeData?.error?.response?.data?.expiredPromocode
                    ? validationsErrorKey.expiredPromocode
                    : validationsErrorKey.invalidPromocode,
              });
            }
          };

          dispatch({ type: PROMOCODE_ACTIONS.FETCHING_STARTED });

          if (
            validatePercengePromocode &&
            promocodeFromUrl &&
            defaultPromocode &&
            selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
            promocode === promocodeFromUrl
          ) {
            const { setFieldValue } = promocodeInputRef.current;
            const [validateData, validateDefaultData] = await Promise.all([
              dopplerAccountPlansApiClient.validatePromocode(selectedMarketingPlan?.id, promocode),
              dopplerAccountPlansApiClient.validatePromocode(
                selectedMarketingPlan?.id,
                defaultPromocode,
              ),
            ]);

            if (
              validateData.success &&
              validateData?.value?.canApply !== false &&
              (!validateDefaultData.success ||
                validateDefaultData?.value?.canApply === false ||
                getPromotionDiscountPercentage(validateData) >=
                  getPromotionDiscountPercentage(validateDefaultData))
            ) {
              dispatchPromocode(validateData);
            } else if (
              validateDefaultData.success &&
              validateDefaultData?.value?.canApply !== false
            ) {
              setFieldValue(fieldNames.promocode, defaultPromocode, false);
              dispatchPromocode(validateDefaultData, defaultPromocode);
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
          } else if (selectedMarketingPlan?.id) {
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
        resetPromocodeState,
        availablePlanQuantities,
        modulePlanType,
        defaultPromocode,
        promocodeFromUrl,
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
      if (suppressValidationUntilPromocodeClearedRef.current) {
        if (!currentPromocode) {
          suppressValidationUntilPromocodeClearedRef.current = false;
        }

        return;
      }

      const shouldValidatePromocode =
        (selectedPaymentFrequency === undefined || selectedPaymentFrequency?.numberMonths === 1) &&
        currentPromocode;
      const validationKey = [
        selectedMarketingPlan?.id || '',
        selectedPaymentFrequency?.id || selectedPaymentFrequency?.numberMonths || '',
        currentPromocode || '',
        manualPromocodeApplied ? 'manual' : 'auto',
      ].join('|');

      if (shouldValidatePromocode) {
        if (planValidationKeyRef.current === validationKey) {
          return;
        }

        if (!alreadyInitializedRef.current) {
          resetPromocodeState();
        }

        planValidationKeyRef.current = validationKey;
        validatePromocode(currentPromocode, !manualPromocodeApplied);
      } else {
        if (!alreadyInitializedRef.current) {
          resetPromocodeState();
        }

        planValidationKeyRef.current = '';
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

      if (suppressValidationUntilPromocodeClearedRef.current) {
        return;
      }

      if (autoInitializationSuppressedRef.current && !currentPromocodeApplied?.promocode) {
        return;
      }

      const promoCodeFromState = currentPromocodeApplied?.promocode || '';
      const promoCodeToInitialize = promoCodeFromState || defaultPromocodeValue;
      const initializationKey = [
        selectedMarketingPlan?.id || '',
        promoCodeToInitialize || '',
        currentPromocodeApplied?.promocode || '',
      ].join('|');
      const currentPlanValidationKey = [
        selectedMarketingPlan?.id || '',
        selectedPaymentFrequency?.id || selectedPaymentFrequency?.numberMonths || '',
        promoCodeToInitialize || '',
        'auto',
      ].join('|');

      if (!promoCodeToInitialize || !allowPromocode || !selectedMarketingPlan?.id) {
        autoInitializedValidationKeyRef.current = '';
        return;
      }

      if (autoInitializedValidationKeyRef.current === initializationKey) {
        return;
      }

      autoInitializedValidationKeyRef.current = initializationKey;

      const { setFieldValue } = promocodeInputRef.current;
      if (
        isArgentina &&
        promoCodeToInitialize === process.env.REACT_APP_PROMOCODE_ARGENTINA &&
        process.env.REACT_APP_PROMOCODE_ARGENTINA !== '' &&
        selectedMarketingPlan?.type !== PLAN_TYPE.byContact
      ) {
        setFieldValue(fieldNames.promocode, '');
      } else {
        const promocodeToSet = promoCodeToInitialize;
        const isPromocodeFromQuery =
          allowDefaultPromocodeFromQuery &&
          Boolean(promocodeFromUrl) &&
          promocodeToSet === promocodeFromUrl;

        const validatePercengePromocode = true;
        if (isPromocodeFromQuery) {
          planValidationKeyRef.current = currentPlanValidationKey;
          validatePromocode(promocodeToSet, validatePercengePromocode, {
            silentlyClearOnInvalid: true,
            setInputOnSuccess: true,
          });
        } else {
          setFieldValue(fieldNames.promocode, promocodeToSet);
          planValidationKeyRef.current = currentPlanValidationKey;
          validatePromocode(promocodeToSet, validatePercengePromocode);
        }
      }
    }, [
      allowDefaultPromocodeFromQuery,
      validatePromocode,
      allowPromocode,
      defaultPromocodeValue,
      selectedMarketingPlan,
      isArgentina,
      defaultPromocodeDismissed,
      hasPromocodeAppliedItem,
      currentPromocodeApplied?.promocode,
      promocodeFromUrl,
      selectedPaymentFrequency?.id,
      selectedPaymentFrequency?.numberMonths,
    ]);

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);
      const shouldHidePromocodeFromQueryInitially =
        allowDefaultPromocodeFromQuery &&
        Boolean(promocodeFromUrl) &&
        !currentPromocodeApplied?.promocode;
      initialValues[fieldNames.promocode] = defaultPromocodeDismissed
        ? ''
        : currentPromocodeApplied?.promocode ||
          (shouldHidePromocodeFromQueryInitially ? '' : defaultPromocodeValue || '');

      return initialValues;
    };

    const onSubmit = async (value) => {
      handleManualPromocodeIntervention && handleManualPromocodeIntervention();
      setManualPromocodeApplied(true);
      validatePromocode(value.promocode, false);
    };

    const promocodeIsDisabled = !allowPromocode || promocodeApplied || loading || disabledPromocode;

    return (
      <section className="dp-promocode">
        <Formik
          onSubmit={onSubmit}
          initialValues={_getFormInitialValues()}
          innerRef={promocodeInputRef}
        >
          {() => (
            <Form className="awa-form dp-form-promocode" aria-label="form">
              <p>{_('checkoutProcessForm.purchase_summary.promocode_header')}</p>
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
        <PromocodeMessages
          allowPromocode={allowPromocode}
          hasPromocodeAppliedItem={hasPromocodeAppliedItem}
          validated={validated}
          promocodeApplied={promocodeApplied}
          promotion={currentPromotion}
          selectedMarketingPlan={selectedMarketingPlan}
          amountDetailsData={amountDetailsData}
          validationError={error}
          promocodeMessageAlreadyShowRef={promocodeMessageAlreadyShowRef}
          hideCanNotApplyMessage={hideCanNotApplyMessage}
        />
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
  defaultPromocode: PropTypes.string,
  allowDefaultPromocodeFromQuery: PropTypes.bool,
  availablePlanQuantities: PropTypes.arrayOf(PropTypes.string),
  modulePlanType: PropTypes.string,
  defaultPromocodeDismissed: PropTypes.bool,
  handleManualPromocodeIntervention: PropTypes.func,
  registerClearPromocodeInput: PropTypes.func,
  hideCanNotApplyMessage: PropTypes.bool,
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
        <label
          htmlFor="promocode"
          className={`labelcontrol ${validated ? 'is-approved' : ''}`}
          aria-disabled={disabled}
        >
          <span
            className={`dp-new-plan-selection-promocode-icon dpicon iconapp-discount-coupon`}
            aria-hidden="true"
          />
          <Field
            type="text"
            id={fieldName}
            name={fieldName}
            placeholder="PROMO50%"
            aria-required={true}
            aria-invalid={!!validationError}
            disabled={disabled}
            {...rest}
          />
          <div className="assistance-wrap">
            <span>{validationError && <FormattedMessage id={validationError} />}</span>
          </div>
        </label>
        <button
          type="button"
          className="dp-btn-delete"
          title="borrar"
          aria-label="borrar"
          disabled={!values[fieldName]}
          onClick={handleRemovePromocode}
        />
      </FieldItem>
      <FieldItem className="field-item field-item--30">
        <button
          type="submit"
          className="dp-button button-big secondary-brown button-medium"
          disabled={disabled}
        >
          {_('buy_process.promocode.apply_btn')}
        </button>
      </FieldItem>
    </>
  );
};

export const getPromocode = (query, isArgentina, isFreeAccount) => {
  const promocodeFromUrl = getPromocodeFromQuery(query);

  return !promocodeFromUrl && isArgentina && isFreeAccount
    ? process.env.REACT_APP_PROMOCODE_ARGENTINA
    : promocodeFromUrl;
};
