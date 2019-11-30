import 'jest';
import { getDataHubParams, useInterval, addDays } from './utils';
import { renderHook } from '@testing-library/react-hooks';

describe('utils', () => {
  describe('getDataHubParams', () => {
    it('should parse url with no params and no hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('');
      expect(dataHubParams.hash).toBe('');
    });
    it('should parse url with no params and hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login#hash');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('');
      expect(dataHubParams.hash).toBe('#hash');
    });
    it('should parse url with params and no hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value');
      expect(dataHubParams.hash).toBe('');
    });
    it('should parse url with params and hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value#hash');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value');
      expect(dataHubParams.hash).toBe('#hash');
    });
    it('should parse url with several params and several hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value&param2=value2#hash1#hash2');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value&param2=value2');
      expect(dataHubParams.hash).toBe('#hash1#hash2');
    });
    it('should parse url with several params even badly formatted and several hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams(
        '/login?param1=value?param2=value2?param3=value3#hash1#hash2',
      );
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value?param2=value2?param3=value3');
      expect(dataHubParams.hash).toBe('#hash1#hash2');
    });
  });

  describe('setInterval custom hook', () => {
    it('should set an interval and update an outside value', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;

      // Act
      renderHook(() =>
        useInterval({
          runOnStart: false,
          delay: 100,
          callback: () => {
            counter++;
          },
        }),
      );
      jest.runOnlyPendingTimers();

      // Assert
      expect(counter).toBe(1);
    });

    it('should set an interval and pause when delay is null', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;
      // Act
      const { rerender } = renderHook(
        ({ delay }) =>
          useInterval({
            runOnStart: false,
            delay: delay,
            callback: () => {
              counter++;
            },
          }),
        { initialProps: { delay: 100 } },
      );
      // Assert
      jest.advanceTimersByTime(600);
      rerender({ delay: null });
      jest.advanceTimersByTime(800);
      expect(counter).toBe(6);
    });

    it('should set an interval and run callback before start', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;
      // Act
      renderHook(() =>
        useInterval({
          runOnStart: true,
          delay: 100,
          callback: () => {
            counter++;
          },
        }),
      );
      expect(counter).toBe(1);

      jest.advanceTimersByTime(200);
      // Assert
      expect(counter).toBe(3);
    });
  });

  describe('addDays feature', () => {
    it('should return a valid date, without mutating the base date', () => {
      // Arrange
      const initialDate = new Date();
      // Act
      const resultDate = addDays(initialDate, 3);
      // Assert
      expect(resultDate.toISOString()).toBeDefined();
      expect(initialDate).not.toEqual(resultDate);
    });

    it('should add three exact days to start date', () => {
      // Arrange
      const initialDate = new Date();
      // Act
      const resultDate = addDays(initialDate, 3);
      // Assert
      expect(resultDate.getDate() - initialDate.getDate()).toBe(3);
    });
  });
});
