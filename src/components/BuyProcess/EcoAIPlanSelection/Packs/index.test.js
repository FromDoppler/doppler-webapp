import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {
  ButtonLess,
  ButtonMore,
  DeleteLandingPacksButton,
  DeletePacksButton,
  Packs,
  filterPackagesEqualOrGreatherToZero,
  isGreatherToMax,
  isInvalidInputValue,
  isLessToMin,
} from '.';
import * as Formik from 'formik';
import { MAX_ECOAI_PACKAGE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Packs', () => {
  it('should to execute handleSave when input value is changed', async () => {
    // Arrange
    const packs = [
      {
        packages: 1,
        packagesQty: 1,
        quantity: 1,
      },
    ];
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');
    useFormikContextMock.mockReturnValue({
      values: {
        packages: packs,
      },
      setFieldValue: () => null,
    });

    render(
      <IntlProvider>
        <Packs packs={packs} formRef={() => null} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('eco_ai_selection.plan_of_eco_ai_with_plural');
  });
});
