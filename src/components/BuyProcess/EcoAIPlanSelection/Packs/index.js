import PropTypes from 'prop-types';
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { MAX_ECOAI_PACKAGE, numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

const ecoAIFieldNames = {
  packages: 'packages',
  quantity: 'packagesQty',
};

export const isInvalidInputValue = (values, index) => {
  return values[`${ecoAIFieldNames.packages}`][index][`${ecoAIFieldNames.quantity}`] < 0 || 
    values[`${ecoAIFieldNames.packages}`][index][`${ecoAIFieldNames.quantity}`] > MAX_ECOAI_PACKAGE;
}

export const isGreatherToMax = (packsSet) =>
  packsSet.findIndex((pack) => pack[ecoAIFieldNames.quantity] > MAX_ECOAI_PACKAGE) > -1;

export const isLessToMin = (packsSet) =>
  packsSet.findIndex((pack) => pack[ecoAIFieldNames.quantity] < 0) > -1;

export const filterPackagesEqualOrGreatherToZero = (packsSet) =>
  packsSet.filter((pack) => pack[ecoAIFieldNames.quantity] > 0);

export const ButtonLess = ({ handleInputValue, index, value }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${ecoAIFieldNames.packages}`][index][`${ecoAIFieldNames.quantity}`],
          `${ecoAIFieldNames.packages}.${index}.${ecoAIFieldNames.quantity}`,
          '-',
        )
      }
      aria-label="button less"
    >
      <span className="dp-button-less">-</span>
    </button>
  );
};

export const DeletePacksButton = ({ handleRemove, loadingRemovePages }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <fieldset className="dp-buttons-packs">
      <button
        type="button"
        className={`dp-button button-medium primary-grey ${
          loadingRemovePages ? 'button--loading' : ''
        }`}
        disabled={loadingRemovePages}
        onClick={handleRemove}
      >
        {_('ai_agent_selection.remove_from_cart_button')}
      </button>
    </fieldset>
  );
};

export const ButtonMore = ({ handleInputValue, index, value }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${ecoAIFieldNames.packages}`][index][`${ecoAIFieldNames.quantity}`],
          `${ecoAIFieldNames.packages}.${index}.${ecoAIFieldNames.quantity}`,
          '+',
        )
      }
      aria-label="button more"
    >
      <span className="dp-button-more">+</span>
    </button>
  );
};

export const Packs = ({ packs, handleSave, formRef, handleRemove, loadingRemove }) => {
  const handleSubmit = (packsSet) => {
    const ecoAI = filterPackagesEqualOrGreatherToZero(packsSet);
    handleSave(ecoAI);
  };

  const handleInputValue = (setFieldValue, currentValue, fieldName, operation) => {
    if (operation === '+') {
      if (currentValue < MAX_ECOAI_PACKAGE) {
        setFieldValue(fieldName, currentValue + 1);
      }
    } else if (currentValue > 0) {
      setFieldValue(fieldName, currentValue - 1);
    }
  };

  const validateBeforeSubmit = (values) => {
    const packsSet = values[ecoAIFieldNames.packages];
    if (!isGreatherToMax(packsSet) && !isLessToMin(packsSet)) {
      handleSubmit(packsSet);
    }
  };

  return (
    <>
      {/* <h3>{_('landing_selection.choose_landings')}</h3> */}
      <Formik
        initialValues={{
          packages: packs,
        }}
        innerRef={formRef}
        validate={validateBeforeSubmit}
        enableReinitialize={true}
      >
        {({ values }) => (
          <Form className="awa-form dp-packs">
            <FieldArray name={ecoAIFieldNames.packages}>
              <>
                {values[ecoAIFieldNames.packages].length > 0 &&
                  values[ecoAIFieldNames.packages].map((pack, index) => (
                    <fieldset key={`pack${index}`}>
                      <div className="dp-pack-box">
                        <p className="dp-mark">
                          <FormattedMessage
                            id="ai_agent_selection.plan_of_eco_ai_with_plural"
                            values={{
                              packs: pack.quantity,
                            }}
                          />
                        </p>
                      </div>
                      <div className="dp-pack-box">
                        <h3>
                          <FormattedMessage
                            id={`landing_selection.pack_price`}
                            values={{
                              price: <FormattedNumber value={pack.fee} {...numberFormatOptions} />,
                            }}
                          />
                        </h3>
                      </div>
                      <div className="dp-pack-box">
                        <label
                          htmlFor="email"
                          className="labelcontrol"
                          aria-disabled="false"
                          data-required={isInvalidInputValue(values, index)}
                        >
                          <ButtonLess
                            handleInputValue={handleInputValue}
                            index={index}
                            value={pack.quantity}
                          />
                          <Field
                            disabled={pack.quantity === 1}
                            name={`${ecoAIFieldNames.packages}.${index}.${ecoAIFieldNames.quantity}`}
                            type="number"
                            placeholder="0"
                            aria-required="true"
                            aria-placeholder="0"
                            aria-invalid={isInvalidInputValue(values, index)}
                            aria-label={`${ecoAIFieldNames.packages}.${index}.${ecoAIFieldNames.quantity}`}
                            min={0}
                            max={MAX_ECOAI_PACKAGE}
                          />
                          <ButtonMore
                            handleInputValue={handleInputValue}
                            index={index}
                            value={pack.quantity}
                          />
                        </label>
                      </div>
                    </fieldset>
                  ))}
              </>
            </FieldArray>
            <DeletePacksButton handleRemove={handleRemove} loadingRemove={loadingRemove} />
          </Form>
        )}
      </Formik>
    </>
  );
};

Packs.propTypes = {
  packs: PropTypes.arrayOf(
    PropTypes.shape({
      planId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      description: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
      unitPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
    }),
  ).isRequired,
  handleSave: PropTypes.func.isRequired,
  formRef: PropTypes.any,
};
