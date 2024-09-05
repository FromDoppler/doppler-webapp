import PropTypes from 'prop-types';
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { MAX_LANDING_PACKAGE, numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

const landingsFieldNames = {
  landingPackages: 'landingPackages',
  packagesQty: 'packagesQty',
};

export const isInvalidInputValue = (values, index) =>
  values[`${landingsFieldNames.landingPackages}`][index][`${landingsFieldNames.packagesQty}`] < 0 ||
  values[`${landingsFieldNames.landingPackages}`][index][`${landingsFieldNames.packagesQty}`] >
    MAX_LANDING_PACKAGE;

export const isGreatherToMax = (landingPacksSet) =>
  landingPacksSet.findIndex(
    (landingPack) => landingPack[landingsFieldNames.packagesQty] > MAX_LANDING_PACKAGE,
  ) > -1;

export const isLessToMin = (landingPacksSet) =>
  landingPacksSet.findIndex((landingPack) => landingPack[landingsFieldNames.packagesQty] < 0) > -1;

export const filterPackagesEqualOrGreatherToZero = (landingPacksSet) =>
  landingPacksSet.filter((landingPack) => landingPack[landingsFieldNames.packagesQty] > 0);

export const ButtonLess = ({ handleInputValue, index }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${landingsFieldNames.landingPackages}`][index][
            `${landingsFieldNames.packagesQty}`
          ],
          `${landingsFieldNames.landingPackages}.${index}.${landingsFieldNames.packagesQty}`,
          '-',
        )
      }
      aria-label="button less"
    >
      <span className="dp-button-less">-</span>
    </button>
  );
};

export const DeleteLandingPacksButton = ({
  handleRemoveLandings,
  loadingRemoveLandingPages,
  showArchiveLandings,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <fieldset className="dp-buttons-packs">
      <button
        type="button"
        className={`dp-button button-medium primary-grey ${
          loadingRemoveLandingPages ? 'button--loading' : ''
        }`}
        disabled={showArchiveLandings || loadingRemoveLandingPages}
        onClick={handleRemoveLandings}
      >
        {_('landing_selection.remove_landings_label')}
      </button>
    </fieldset>
  );
};

export const ButtonMore = ({ handleInputValue, index }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${landingsFieldNames.landingPackages}`][index][
            `${landingsFieldNames.packagesQty}`
          ],
          `${landingsFieldNames.landingPackages}.${index}.${landingsFieldNames.packagesQty}`,
          '+',
        )
      }
      aria-label="button more"
    >
      <span className="dp-button-more">+</span>
    </button>
  );
};

export const LandingPacks = ({
  landingPacks,
  handleSave,
  formRef,
  handleRemoveLandings,
  showArchiveLandings,
  loadingRemoveLandingPages,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const handleSubmit = (landingPacksSet) => {
    const landings = filterPackagesEqualOrGreatherToZero(landingPacksSet);
    handleSave(landings);
  };

  const handleInputValue = (setFieldValue, currentValue, fieldName, operation) => {
    if (operation === '+') {
      if (currentValue < MAX_LANDING_PACKAGE) {
        setFieldValue(fieldName, currentValue + 1);
      }
    } else if (currentValue > 0) {
      setFieldValue(fieldName, currentValue - 1);
    }
  };

  const validateBeforeSubmit = (values) => {
    const landingPacksSet = values[landingsFieldNames.landingPackages];
    if (!isGreatherToMax(landingPacksSet) && !isLessToMin(landingPacksSet)) {
      handleSubmit(landingPacksSet);
    }
  };

  return (
    <>
      <h3>{_('landing_selection.choose_landings')}</h3>
      <Formik
        initialValues={{
          landingPackages: landingPacks,
        }}
        innerRef={formRef}
        validate={validateBeforeSubmit}
        enableReinitialize={true}
      >
        {({ values }) => (
          <Form className="awa-form dp-packs">
            <FieldArray name={landingsFieldNames.landingPackages}>
              <>
                {values[landingsFieldNames.landingPackages].length > 0 &&
                  values[landingsFieldNames.landingPackages].map((landingPack, index) => (
                    <fieldset key={`pack${index}`}>
                      <div className="dp-pack-box">
                        <p className="dp-mark">
                          <FormattedMessage
                            id={`landing_selection.pack_of_landing_pages`}
                            values={{
                              packs: landingPack.landingsQty,
                            }}
                          />
                        </p>
                      </div>
                      <div className="dp-pack-box">
                        <h3>
                          <FormattedMessage
                            id={`landing_selection.pack_price`}
                            values={{
                              price: (
                                <FormattedNumber
                                  value={landingPack.price}
                                  {...numberFormatOptions}
                                />
                              ),
                            }}
                          />
                        </h3>
                        <p>
                          <FormattedMessage
                            id={`landing_selection.pack_unit_price`}
                            values={{
                              unitPrice: (
                                <FormattedNumber
                                  value={landingPack.unitPrice}
                                  {...numberFormatOptions}
                                />
                              ),
                            }}
                          />
                        </p>
                      </div>
                      <div className="dp-pack-box">
                        <label
                          htmlFor="email"
                          className="labelcontrol"
                          aria-disabled="false"
                          data-required={isInvalidInputValue(values, index)}
                        >
                          <ButtonLess handleInputValue={handleInputValue} index={index} />
                          <Field
                            name={`${landingsFieldNames.landingPackages}.${index}.${landingsFieldNames.packagesQty}`}
                            type="number"
                            placeholder="0"
                            aria-required="true"
                            aria-placeholder="0"
                            aria-invalid={isInvalidInputValue(values, index)}
                            aria-label={`${landingsFieldNames.landingPackages}.${index}.${landingsFieldNames.packagesQty}`}
                            min={0}
                            max={MAX_LANDING_PACKAGE}
                          />
                          <ButtonMore handleInputValue={handleInputValue} index={index} />
                        </label>
                      </div>
                    </fieldset>
                  ))}
              </>
            </FieldArray>
            <DeleteLandingPacksButton
              handleRemoveLandings={handleRemoveLandings}
              loadingRemoveLandingPages={loadingRemoveLandingPages}
              showArchiveLandings={showArchiveLandings}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

LandingPacks.propTypes = {
  landingPacks: PropTypes.arrayOf(
    PropTypes.shape({
      planId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      description: PropTypes.string,
      landingsQty: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
      unitPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
    }),
  ).isRequired,
  handleSave: PropTypes.func.isRequired,
  formRef: PropTypes.any,
};
