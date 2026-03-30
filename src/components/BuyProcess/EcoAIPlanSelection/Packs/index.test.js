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
        packagesQty: 0,
      },
    ];
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');
    useFormikContextMock.mockReturnValue({
      values: {
        packages: packs,
      },
      setFieldValue: () => null,
    });

    const handleSave = jest.fn();
    render(
      <IntlProvider>
        <Packs
          packs={packs}
          handleSave={handleSave}
          formRef={() => null}
          showRemoveLandings={true}
        />
      </IntlProvider>,
    );
    expect(handleSave).not.toHaveBeenCalled();
    const user = userEvent.setup();

    // Choose 3 packs of 5 landings
    await act(() =>
      user.clear(screen.getByRole('spinbutton', { name: /packages.0.packagesQty/i })),
    );
    await act(() =>
      user.type(screen.getByRole('spinbutton', { name: /packages.0.packagesQty/i }), '1'),
    );
    expect(screen.getByRole('spinbutton', { name: /packages.0.packagesQty/i })).toHaveValue(
      1,
    );
    screen.getByRole('button', { name: /ai_agent_selection.remove_from_cart_button/i });
    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith([
        {
          packages: 1,
          packagesQty: 1,
        },
      ]);
    });
  });

  describe('isInvalidInputValue function', () => {
      it('should return "true" when is < 0 or is > allowed limit ', async () => {
        // Arrange
        const index = 0;

        // case < 0
        let invalidPackageQty = isInvalidInputValue(
          {
            packages: [
              {
                packagesQty: -1,
              },
            ],
          },
          index,
        );

        console.log(invalidPackageQty);

        expect(invalidPackageQty).toBeTruthy();

        // case > MAX_ECOAI_PACKAGE
        invalidPackageQty = isInvalidInputValue(
          {
            packages: [
              {
                packagesQty: MAX_ECOAI_PACKAGE + 1,
              },
            ],
          },
          index,
        );
        expect(invalidPackageQty).toBeTruthy();
      });

      it('should return "false" when is >= 0 or is <= allowed limit ', async () => {
        // Arrange
        const index = 0;

        // case >= 0 and <= MAX_ECOAI_PACKAGE
        let invalidPackageQty = isInvalidInputValue(
          {
            packages: [
              {
                packagesQty: 1,
              },
            ],
          },
          index,
        );
        expect(invalidPackageQty).toBeFalsy();
      });
  });

  describe('isGreatherToMax function', () => {
    it('should return "true" when there is a pack greather to allowed limit', async () => {
      // Arrange
      const packsSet = [
        {
          packagesQty: 1,
        },
        {
          packagesQty: MAX_ECOAI_PACKAGE + 1,
        },
      ];

      const finded = isGreatherToMax(packsSet);
      expect(finded).toBeTruthy();
    });

    it('should return "false" when there is not a pack greather to allowed limit', async () => {
      // Arrange
      const packsSet = [
        {
          packagesQty: 1,
        },
        {
          packagesQty: MAX_ECOAI_PACKAGE,
        },
      ];

      const finded = isGreatherToMax(packsSet);
      expect(finded).not.toBeTruthy();
    });
  });

  describe('isLessToMin function', () => {
    it('should return "true" when there is a pack less to 0', async () => {
      // Arrange
      const packsSet = [
        {
          packagesQty: -2,
        },
      ];

      const finded = isLessToMin(packsSet);
      expect(finded).toBeTruthy();
    });

    it('should return "false" when there is not a pack less to 0', async () => {
      // Arrange
      const packsSet = [
        {
          packagesQty: 0,
        },
      ];

      const finded = isLessToMin(packsSet);
      expect(finded).not.toBeTruthy();
    });
  });

  
  describe('filterPackagesEqualOrGreatherToZero function', () => {
    it('should return just the landings packs > 0', async () => {
      // Arrange
      const packsSet = [
        {
          packagesQty: 0,
        },
        {
          packagesQty: 1,
        },
      ];

      const landingPacksFiltered = filterPackagesEqualOrGreatherToZero(packsSet);
      expect(landingPacksFiltered).toEqual([
        {
          packagesQty: 1,
        },
      ]);
    });
  });

  
  describe('ButtonLess', () => {
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');

    beforeEach(() => {
      useFormikContextMock.mockReturnValue({
        values: {
          packages: [
            {
              packagesQty: 1,
            },
          ],
        },
        setFieldValue: () => null,
      });
    });

    it('should render ButtonLess component', async () => {
      const handleInputValue = jest.fn();
      expect(handleInputValue).not.toHaveBeenCalled();
      render(<ButtonLess handleInputValue={handleInputValue} index={0} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /button less/i }));

      await waitFor(() => expect(handleInputValue).toHaveBeenCalled());
    });
  });

  describe('ButtonMore', () => {
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');

    beforeEach(() => {
      useFormikContextMock.mockReturnValue({
        values: {
          packages: [
            {
              packagesQty: 2,
            },
          ],
        },
        setFieldValue: () => null,
      });
    });

    it('should render ButtonMore component', async () => {
      const handleInputValue = jest.fn();
      expect(handleInputValue).not.toHaveBeenCalled();
      render(<ButtonMore handleInputValue={handleInputValue} index={0} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /button more/i }));

      await waitFor(() => expect(handleInputValue).toHaveBeenCalled());
    });
  });
});