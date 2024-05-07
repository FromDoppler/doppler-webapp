import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {
  ButtonLess,
  ButtonMore,
  LandingPacks,
  filterPackagesEqualOrGreatherToZero,
  isGreatherToMax,
  isInvalidInputValue,
  isLessToMin,
} from '.';
import * as Formik from 'formik';
import { MAX_LANDING_PACKAGE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('LandingPacks', () => {
  it('should to execute handleSave when input value is changed', async () => {
    // Arrange
    const landingPacks = [
      {
        landingsQty: 5,
        packagesQty: 2,
      },
      {
        landingsQty: 25,
        packagesQty: 1,
      },
      {
        landingsQty: 50,
        packagesQty: 0,
      },
      {
        landingsQty: 100,
        packagesQty: 0,
      },
    ];
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');
    useFormikContextMock.mockReturnValue({
      values: {
        landingPackages: landingPacks,
      },
      setFieldValue: () => null,
    });

    const handleSave = jest.fn();
    render(
      <IntlProvider>
        <LandingPacks landingPacks={landingPacks} handleSave={handleSave} formRef={() => null} />
      </IntlProvider>,
    );
    expect(handleSave).not.toHaveBeenCalled();
    const user = userEvent.setup();

    // Choose 3 packs of 5 landings
    await act(() =>
      user.clear(screen.getByRole('spinbutton', { name: /landingPackages.0.packagesQty/i })),
    );
    await act(() =>
      user.type(screen.getByRole('spinbutton', { name: /landingPackages.0.packagesQty/i }), '3'),
    );
    expect(screen.getByRole('spinbutton', { name: /landingPackages.0.packagesQty/i })).toHaveValue(
      3,
    );
    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith([
        {
          landingsQty: 5,
          packagesQty: 3,
        },
        {
          landingsQty: 25,
          packagesQty: 1,
        },
      ]);
    });

    // Choose 1 pack of 50 landings
    await act(() =>
      user.clear(screen.getByRole('spinbutton', { name: /landingPackages.2.packagesQty/i })),
    );
    await act(() =>
      user.type(screen.getByRole('spinbutton', { name: /landingPackages.2.packagesQty/i }), '1'),
    );
    expect(screen.getByRole('spinbutton', { name: /landingPackages.2.packagesQty/i })).toHaveValue(
      1,
    );
    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith([
        {
          landingsQty: 5,
          packagesQty: 3,
        },
        {
          landingsQty: 25,
          packagesQty: 1,
        },
        {
          landingsQty: 50,
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
          landingPackages: [
            {
              packagesQty: -1,
            },
          ],
        },
        index,
      );
      expect(invalidPackageQty).toBeTruthy();

      // case > MAX_LANDING_PACKAGE
      invalidPackageQty = isInvalidInputValue(
        {
          landingPackages: [
            {
              packagesQty: MAX_LANDING_PACKAGE + 1,
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

      // case >= 0 and <= MAX_LANDING_PACKAGE
      let invalidPackageQty = isInvalidInputValue(
        {
          landingPackages: [
            {
              packagesQty: 3,
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
      const landingPacksSet = [
        {
          packagesQty: 3,
        },
        {
          packagesQty: MAX_LANDING_PACKAGE + 2,
        },
      ];

      const finded = isGreatherToMax(landingPacksSet);
      expect(finded).toBeTruthy();
    });

    it('should return "false" when there is not a pack greather to allowed limit', async () => {
      // Arrange
      const landingPacksSet = [
        {
          packagesQty: 3,
        },
        {
          packagesQty: MAX_LANDING_PACKAGE,
        },
      ];

      const finded = isGreatherToMax(landingPacksSet);
      expect(finded).not.toBeTruthy();
    });
  });

  describe('isLessToMin function', () => {
    it('should return "true" when there is a pack less to 0', async () => {
      // Arrange
      const landingPacksSet = [
        {
          packagesQty: 3,
        },
        {
          packagesQty: -2,
        },
      ];

      const finded = isLessToMin(landingPacksSet);
      expect(finded).toBeTruthy();
    });

    it('should return "false" when there is not a pack less to 0', async () => {
      // Arrange
      const landingPacksSet = [
        {
          packagesQty: 3,
        },
        {
          packagesQty: 0,
        },
      ];

      const finded = isLessToMin(landingPacksSet);
      expect(finded).not.toBeTruthy();
    });
  });

  describe('filterPackagesEqualOrGreatherToZero function', () => {
    it('should return just the landings packs > 0', async () => {
      // Arrange
      const landingPacksSet = [
        {
          packagesQty: 3,
        },
        {
          packagesQty: 0,
        },
        {
          packagesQty: -3,
        },
        {
          packagesQty: 5,
        },
      ];

      const landingPacksFiltered = filterPackagesEqualOrGreatherToZero(landingPacksSet);
      expect(landingPacksFiltered).toEqual([
        {
          packagesQty: 3,
        },
        {
          packagesQty: 5,
        },
      ]);
    });
  });

  describe('ButtonLess', () => {
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');

    beforeEach(() => {
      useFormikContextMock.mockReturnValue({
        values: {
          landingPackages: [
            {
              packagesQty: 2,
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
          landingPackages: [
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
