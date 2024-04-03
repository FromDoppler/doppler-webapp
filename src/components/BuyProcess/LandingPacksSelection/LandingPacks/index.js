import PropTypes from 'prop-types';
import { Formik, Field, Form, FieldArray, useFormikContext } from 'formik';
import { MAX_LANDING_PACKAGE } from '../../../../doppler-types';

const fieldNames = {
  landingPackages: 'landingPackages',
  packagesQty: 'packagesQty',
};

const isInvalidInputValue = (values, index) =>
  values[`${fieldNames.landingPackages}`][index][`${fieldNames.packagesQty}`] < 0 ||
  values[`${fieldNames.landingPackages}`][index][`${fieldNames.packagesQty}`] > MAX_LANDING_PACKAGE;

const LandingPackButton = ({ selectedLandings, handleRemove }) => {
  const { values } = useFormikContext();

  return (
    <fieldset className="dp-buttons-packs">
      {selectedLandings?.length > 0 ? (
        <button
          type="button"
          className="dp-button button-medium ctaTertiary"
          onClick={handleRemove}
        >
          Remover de carrito
        </button>
      ) : (
        <button
          type="submit"
          className="dp-button button-medium ctaTertiary"
          disabled={
            // is disabled when there is a value < 0 or value > 10 or when all values are zero
            values[fieldNames.landingPackages].findIndex(
              (landingPack) => landingPack[fieldNames.packagesQty] > 0,
            ) < 0 ||
            values[fieldNames.landingPackages].findIndex(
              (landingPack) => landingPack[fieldNames.packagesQty] > MAX_LANDING_PACKAGE,
            ) > -1 ||
            values[fieldNames.landingPackages].findIndex(
              (landingPack) => landingPack[fieldNames.packagesQty] < 0,
            ) > -1
          }
        >
          Agregar al carrito
        </button>
      )}
    </fieldset>
  );
};

const ButtonLess = ({ selectedLandings, handleInputValue, index }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      disabled={selectedLandings?.length > 0}
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${fieldNames.landingPackages}`][index][`${fieldNames.packagesQty}`],
          `${fieldNames.landingPackages}.${index}.${fieldNames.packagesQty}`,
          '-',
        )
      }
    >
      <span className="dp-button-less">-</span>
    </button>
  );
};

const ButtonMore = ({ selectedLandings, handleInputValue, index }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      disabled={selectedLandings?.length > 0}
      onClick={() =>
        handleInputValue(
          setFieldValue,
          values[`${fieldNames.landingPackages}`][index][`${fieldNames.packagesQty}`],
          `${fieldNames.landingPackages}.${index}.${fieldNames.packagesQty}`,
          '+',
        )
      }
    >
      <span className="dp-button-more">+</span>
    </button>
  );
};

export const LandingPacks = ({
  landingPacks,
  selectedLandings,
  handleSave,
  handleRemove,
  formRef,
}) => {
  const handleSubmit = (values) =>
    handleSave(
      values[fieldNames.landingPackages].filter(
        (landingPack) => landingPack[fieldNames.packagesQty] > 0,
      ),
    );

  const handleInputValue = (setFieldValue, currentValue, fieldName, operation) => {
    if (operation === '+') {
      if (currentValue < MAX_LANDING_PACKAGE) {
        setFieldValue(fieldName, currentValue + 1);
      }
    } else if (currentValue > 0) {
      setFieldValue(fieldName, currentValue - 1);
    }
  };

  const landingPackages = landingPacks?.map((landingPack) => ({ ...landingPack, packagesQty: 0 }));

  return (
    <Formik
      initialValues={{
        landingPackages,
      }}
      onSubmit={handleSubmit}
      innerRef={formRef}
    >
      {({ values }) => (
        <Form className="awa-form dp-packs">
          <h3>Packs de Landings</h3>
          <FieldArray name={fieldNames.landingPackages}>
            <>
              {values[fieldNames.landingPackages].length > 0 &&
                values[fieldNames.landingPackages].map((landingPack, index) => (
                  <fieldset key={`pack${index}`}>
                    <div className="dp-pack-box">
                      <p className="dp-mark">Pack de {landingPack.landingsQty} landings</p>
                    </div>
                    <div className="dp-pack-box">
                      <h3>US$ {landingPack.price}*/mes</h3>
                      <p>Precio: US${landingPack.unitPrice} c/u</p>
                    </div>
                    <div className="dp-pack-box">
                      <label
                        htmlFor="email"
                        className="labelcontrol"
                        aria-disabled="false"
                        data-required={isInvalidInputValue(values, index)}
                      >
                        <ButtonLess
                          selectedLandings={selectedLandings}
                          handleInputValue={handleInputValue}
                          index={index}
                        />
                        <Field
                          name={`${fieldNames.landingPackages}.${index}.${fieldNames.packagesQty}`}
                          type="number"
                          placeholder="0"
                          aria-required="true"
                          aria-placeholder="0"
                          aria-invalid={isInvalidInputValue(values, index)}
                          min={0}
                          max={MAX_LANDING_PACKAGE}
                          disabled={selectedLandings?.length > 0}
                        />
                        <ButtonMore
                          selectedLandings={selectedLandings}
                          handleInputValue={handleInputValue}
                          index={index}
                        />
                      </label>
                    </div>
                  </fieldset>
                ))}
            </>
          </FieldArray>
          <LandingPackButton selectedLandings={selectedLandings} handleRemove={handleRemove} />
        </Form>
      )}
    </Formik>
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
  handleRemove: PropTypes.func,
};
